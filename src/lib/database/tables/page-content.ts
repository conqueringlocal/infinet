
import { supabase } from '../../supabase';
import { executeSql } from '../utils';

/**
 * SQL definition for the page_content table
 */
const PAGE_CONTENT_SQL = `
CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_data JSONB NOT NULL,
  version INT NOT NULL DEFAULT 1,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.user_profiles(id),
  updated_by UUID REFERENCES public.user_profiles(id),
  UNIQUE(page_id, content_id, version)
);

-- RLS policies for page_content
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Create view policy for published content
CREATE POLICY "Anyone can view published content" 
  ON public.page_content FOR SELECT 
  USING (published = true);

-- Create view policy for assigned editors
CREATE POLICY "Assigned editors can view all page content" 
  ON public.page_content FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.page_assignments 
      WHERE page_id = page_content.page_id 
      AND user_id = auth.uid()
    )
  );

-- Create admin view policy
CREATE POLICY "Admins can view all content" 
  ON public.page_content FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create editor modify policy
CREATE POLICY "Assigned editors can modify content" 
  ON public.page_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.page_assignments 
      WHERE page_id = page_content.page_id 
      AND user_id = auth.uid()
    )
  );

-- Create admin modify policy
CREATE POLICY "Admins can modify all content" 
  ON public.page_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
`;

// Simpler SQL that just creates the table structure without policies
const SIMPLE_PAGE_CONTENT_SQL = `
CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_data JSONB NOT NULL,
  version INT NOT NULL DEFAULT 1,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.user_profiles(id),
  updated_by UUID REFERENCES public.user_profiles(id),
  UNIQUE(page_id, content_id, version)
);
`;

// Basic policies without referencing other tables
const BASIC_POLICIES_SQL = `
-- RLS policies for page_content
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Create view policy for published content
CREATE POLICY "Anyone can view published content" 
  ON public.page_content FOR SELECT 
  USING (published = true);

-- Create admin view policy
CREATE POLICY "Admins can view all content" 
  ON public.page_content FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create admin modify policy
CREATE POLICY "Admins can modify all content" 
  ON public.page_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
`;

// Advanced policies that reference page_assignments
const ADVANCED_POLICIES_SQL = `
-- Create view policy for assigned editors
CREATE POLICY "Assigned editors can view all page content" 
  ON public.page_content FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.page_assignments 
      WHERE page_id = page_content.page_id 
      AND user_id = auth.uid()
    )
  );

-- Create editor modify policy
CREATE POLICY "Assigned editors can modify content" 
  ON public.page_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.page_assignments 
      WHERE page_id = page_content.page_id 
      AND user_id = auth.uid()
    )
  );
`;

/**
 * Creates the page_content table if it doesn't exist
 */
export const initializePageContentTable = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Creating page_content table...');
    
    // Check if the table already exists
    const { error: checkError } = await supabase
      .from('page_content')
      .select('id')
      .limit(1);
    
    if (checkError) {
      if (checkError.code === '42P01') { // Table doesn't exist code
        console.log('Table page_content does not exist, creating it...');
        
        // Try the direct fetch approach that worked for user_profiles
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gqcfneuiruffgpwhkecy.supabase.co';
          const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxY2ZuZXVpcnVmZmdwd2hrZWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NjUyNzAsImV4cCI6MjA1ODU0MTI3MH0.Wm8coMFjXv8TA2bQfiXoDYjzml92iTPSDuZOlPJhD_0';
          
          // First create the table structure
          const tableResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': apiKey,
              'Authorization': `Bearer ${apiKey}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ 
              query: SIMPLE_PAGE_CONTENT_SQL 
            })
          });
          
          if (tableResponse.ok) {
            console.log('Successfully created page_content table via direct fetch');
            
            // Now try to add basic RLS policies first
            const basicPolicyResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': apiKey,
                'Authorization': `Bearer ${apiKey}`,
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify({ 
                query: BASIC_POLICIES_SQL 
              })
            });
            
            console.log('Basic policy response:', basicPolicyResponse.ok ? 'successful' : 'failed');
            
            // Check if page_assignments exists before adding the policies that depend on it
            const { error: checkAssignmentsError } = await supabase
              .from('page_assignments')
              .select('id')
              .limit(1);
            
            if (!checkAssignmentsError) {
              console.log('page_assignments table exists, adding advanced policies');
              
              // Now try to add advanced policies that depend on page_assignments
              const advancedPolicyResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': apiKey,
                  'Authorization': `Bearer ${apiKey}`,
                  'Prefer': 'return=minimal'
                },
                body: JSON.stringify({ 
                  query: ADVANCED_POLICIES_SQL 
                })
              });
              
              console.log('Advanced policy response:', advancedPolicyResponse.ok ? 'successful' : 'failed');
            } else {
              console.log('page_assignments table does not exist yet, skipping advanced policies');
            }
            
            return { success: true, message: 'Page content table created successfully' };
          } else {
            throw new Error('Failed to create table via direct fetch');
          }
        } catch (error) {
          console.warn('Failed to create table via direct fetch:', error);
        }
        
        // If all automated approaches fail, return the COMPLETE SQL for manual creation
        return { 
          success: false, 
          message: 'Could not automatically create the page_content table. Please create it manually in the Supabase dashboard using this SQL:\n\n' + PAGE_CONTENT_SQL
        };
      } else {
        console.error('Error checking page_content table:', checkError);
        return { success: false, message: `Error checking page_content table: ${checkError.message}` };
      }
    } else {
      console.log('page_content table already exists');
    }
    
    return { success: true, message: 'Page content table initialized successfully' };
  } catch (error) {
    console.error('Error initializing page_content table:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error initializing page_content table' 
    };
  }
};
