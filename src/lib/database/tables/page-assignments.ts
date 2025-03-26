
import { supabase } from '../../supabase';
import { executeSql } from '../utils';

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
        
        // Create the table with direct SQL query
        const sqlResult = await executeSql(`
          CREATE TABLE IF NOT EXISTS public.page_assignments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            page_id TEXT NOT NULL,
            user_id UUID NOT NULL REFERENCES public.user_profiles(id),
            role TEXT NOT NULL DEFAULT 'editor',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(page_id, user_id)
          );
          
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
        `);
        
        if (!sqlResult.success) {
          console.error('Error creating page_assignments table:', sqlResult.message);
          return { success: false, message: `Error creating page_assignments table: ${sqlResult.message}` };
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
