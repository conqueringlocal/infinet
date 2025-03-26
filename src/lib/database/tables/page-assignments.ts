
import { supabase } from '../../supabase';

/**
 * SQL definition for the page_assignments table
 */
const PAGE_ASSIGNMENTS_SQL = `
CREATE TABLE IF NOT EXISTS public.page_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id),
  role TEXT NOT NULL DEFAULT 'editor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_id, user_id)
);
`;

/**
 * SQL for adding RLS policies after table creation
 */
const PAGE_ASSIGNMENTS_POLICIES_SQL = `
-- RLS policies for page_assignments
ALTER TABLE public.page_assignments ENABLE ROW LEVEL SECURITY;

-- Create view policy
CREATE POLICY "Users can view their own page assignments" 
  ON public.page_assignments FOR SELECT 
  USING (user_id = auth.uid());

-- Create admin view policy
CREATE POLICY "Admins can view all page assignments" 
  ON public.page_assignments FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create admin modify policy
CREATE POLICY "Admins can modify page assignments" 
  ON public.page_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
`;

/**
 * Creates the page_assignments table if it doesn't exist
 */
export const initializePageAssignmentsTable = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Creating page_assignments table...');
    
    // Check if the table already exists
    const { error: checkError } = await supabase
      .from('page_assignments')
      .select('id')
      .limit(1);
    
    if (checkError) {
      if (checkError.code === '42P01') { // Table doesn't exist code
        console.log('Table page_assignments does not exist, creating it...');
        
        // Use direct fetch approach to create the table
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gqcfneuiruffgpwhkecy.supabase.co';
          const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxY2ZuZXVpcnVmZmdwd2hrZWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NjUyNzAsImV4cCI6MjA1ODU0MTI3MH0.Wm8coMFjXv8TA2bQfiXoDYjzml92iTPSDuZOlPJhD_0';
          
          // First create just the table structure without policies
          const tableResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': apiKey,
              'Authorization': `Bearer ${apiKey}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ 
              query: PAGE_ASSIGNMENTS_SQL 
            })
          });
          
          if (tableResponse.ok) {
            console.log('Successfully created page_assignments table via direct fetch');
            
            // Now try to add RLS policies
            const policyResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': apiKey,
                'Authorization': `Bearer ${apiKey}`,
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify({ 
                query: PAGE_ASSIGNMENTS_POLICIES_SQL 
              })
            });
            
            if (policyResponse.ok) {
              return { success: true, message: 'Page assignments table and policies created successfully' };
            } else {
              console.warn('Could not create policies, but table was created');
              return { success: true, message: 'Page assignments table created, but policies may need manual setup' };
            }
          } else {
            console.error('Failed to create table via direct fetch');
            throw new Error('Failed to create table via direct fetch');
          }
        } catch (error) {
          console.warn('Failed to create table via direct fetch:', error);
          
          // If automated approach fails, return SQL for manual creation
          return { 
            success: false, 
            message: 'Could not automatically create the page_assignments table. Please create it manually in the Supabase dashboard using this SQL:\n\n' + PAGE_ASSIGNMENTS_SQL + '\n\n' + PAGE_ASSIGNMENTS_POLICIES_SQL
          };
        }
      } else {
        console.error('Error checking page_assignments table:', checkError);
        return { success: false, message: `Error checking page_assignments table: ${checkError.message}` };
      }
    } else {
      console.log('page_assignments table already exists');
    }
    
    return { success: true, message: 'Page assignments table initialized successfully' };
  } catch (error) {
    console.error('Error initializing page_assignments table:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error initializing page_assignments table' 
    };
  }
};
