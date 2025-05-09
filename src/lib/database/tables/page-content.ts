
import { supabase } from '../../supabase';

/**
 * SQL definition for the page_content table - just the table structure
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
`;

/**
 * Basic RLS policies that don't depend on other tables
 */
const BASIC_POLICIES_SQL = `
-- Enable RLS
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Anyone can view published content
CREATE POLICY "Anyone can view published content" 
  ON public.page_content FOR SELECT 
  USING (published = true);

-- Admin access
CREATE POLICY "Admins can view all content" 
  ON public.page_content FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin modify access
CREATE POLICY "Admins can modify all content" 
  ON public.page_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
`;

/**
 * Advanced RLS policies that depend on page_assignments table
 */
const EDITOR_POLICIES_SQL = `
-- Editor view access through page assignments
CREATE POLICY "Assigned editors can view all page content" 
  ON public.page_content FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.page_assignments 
      WHERE page_id = page_content.page_id 
      AND user_id = auth.uid()
    )
  );

-- Editor modify access through page assignments
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
        
        // Use direct fetch approach for creating the table
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gqcfneuiruffgpwhkecy.supabase.co';
        const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxY2ZuZXVpcnVmZmdwd2hrZWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NjUyNzAsImV4cCI6MjA1ODU0MTI3MH0.Wm8coMFjXv8TA2bQfiXoDYjzml92iTPSDuZOlPJhD_0';
        
        try {
          // First create just the table structure
          const tableResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': apiKey,
              'Authorization': `Bearer ${apiKey}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ 
              query: PAGE_CONTENT_SQL 
            })
          });
          
          if (!tableResponse.ok) {
            throw new Error('Failed to create page_content table');
          }
          
          console.log('Successfully created page_content table');
          
          // Add basic policies
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
          
          if (!basicPolicyResponse.ok) {
            console.warn('Failed to add basic policies, but table was created');
          } else {
            console.log('Successfully added basic policies');
          }
          
          // Check if page_assignments exists before adding editor policies
          const { error: assignmentsCheckError } = await supabase
            .from('page_assignments')
            .select('id')
            .limit(1);
          
          if (!assignmentsCheckError) {
            console.log('page_assignments table exists, adding editor policies');
            
            // Add editor policies that depend on page_assignments
            const editorPolicyResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': apiKey,
                'Authorization': `Bearer ${apiKey}`,
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify({ 
                query: EDITOR_POLICIES_SQL 
              })
            });
            
            if (!editorPolicyResponse.ok) {
              console.warn('Failed to add editor policies, but table and basic policies were created');
            } else {
              console.log('Successfully added editor policies');
            }
          } else {
            console.log('page_assignments table does not exist yet, skipping editor policies');
          }
          
          return { success: true, message: 'Page content table created successfully' };
        } catch (error) {
          console.error('Error creating page_content table:', error);
          
          // Return the complete SQL for manual creation
          return { 
            success: false, 
            message: 'Could not automatically create the page_content table. Please create it manually in the Supabase dashboard using this SQL:\n\n' + 
              PAGE_CONTENT_SQL + '\n\n' + BASIC_POLICIES_SQL + '\n\n' + 
              '-- After page_assignments table is created, add these policies:\n' + 
              EDITOR_POLICIES_SQL
          };
        }
      } else {
        console.error('Error checking page_content table:', checkError);
        return { success: false, message: `Error checking page_content table: ${checkError.message}` };
      }
    } else {
      console.log('page_content table already exists');
      return { success: true, message: 'Page content table already exists' };
    }
  } catch (error) {
    console.error('Error initializing page_content table:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error initializing page_content table' 
    };
  }
};
