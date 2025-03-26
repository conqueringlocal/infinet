
import { supabase } from '../../supabase';

/**
 * Creates the page_assignments table if it doesn't exist
 */
export const initializePageAssignmentsTable = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Creating page_assignments table...');
    
    const { error: assignmentsError } = await supabase
      .from('page_assignments')
      .select('id')
      .limit(1);
    
    if (assignmentsError) {
      if (assignmentsError.code === '42P01') { // Table doesn't exist
        console.log('Table page_assignments does not exist, creating it...');
        
        // Create table with raw query
        const { error: createTableError } = await supabase.rpc('execute_sql', {
          query: `
            CREATE TABLE IF NOT EXISTS public.page_assignments (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID NOT NULL,
              page_path TEXT NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              UNIQUE(user_id, page_path)
            );
          `
        });
        
        if (createTableError) {
          console.error('Error creating page_assignments table:', createTableError);
          return { success: false, message: `Error creating page_assignments table: ${createTableError.message}` };
        }
        
        // Add foreign key constraint and RLS
        const { error: foreignKeyError } = await supabase.rpc('execute_sql', {
          query: `
            ALTER TABLE public.page_assignments 
            ADD CONSTRAINT page_assignments_user_id_fkey 
            FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;
            
            -- RLS policies for page_assignments
            ALTER TABLE public.page_assignments ENABLE ROW LEVEL SECURITY;
          `
        });
        
        if (foreignKeyError) {
          console.error('Error adding foreign key constraint:', foreignKeyError);
        }
        
        // Create policies
        const { error: viewOwnPolicyError } = await supabase.rpc('execute_sql', {
          query: `
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_policies WHERE tablename = 'page_assignments' AND policyname = 'Users can view own assignments'
              ) THEN
                CREATE POLICY "Users can view own assignments" 
                  ON public.page_assignments FOR SELECT 
                  USING (auth.uid() = user_id);
              END IF;
            END
            $$;
          `
        });
        
        if (viewOwnPolicyError) {
          console.error('Error creating view own policy:', viewOwnPolicyError);
        }
        
        const { error: viewAllPolicyError } = await supabase.rpc('execute_sql', {
          query: `
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_policies WHERE tablename = 'page_assignments' AND policyname = 'Admins and editors can view all assignments'
              ) THEN
                CREATE POLICY "Admins and editors can view all assignments" 
                  ON public.page_assignments FOR SELECT 
                  USING (
                    EXISTS (
                      SELECT 1 FROM public.user_profiles 
                      WHERE id = auth.uid() AND role IN ('admin', 'editor')
                    )
                  );
              END IF;
            END
            $$;
          `
        });
        
        if (viewAllPolicyError) {
          console.error('Error creating view all policy:', viewAllPolicyError);
        }
        
        const { error: modifyPolicyError } = await supabase.rpc('execute_sql', {
          query: `
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_policies WHERE tablename = 'page_assignments' AND policyname = 'Only admins can modify assignments'
              ) THEN
                CREATE POLICY "Only admins can modify assignments" 
                  ON public.page_assignments 
                  USING (
                    EXISTS (
                      SELECT 1 FROM public.user_profiles 
                      WHERE id = auth.uid() AND role = 'admin'
                    )
                  );
              END IF;
            END
            $$;
          `
        });
        
        if (modifyPolicyError) {
          console.error('Error creating modify policy:', modifyPolicyError);
        }
      } else {
        console.error('Error checking page_assignments table:', assignmentsError);
        return { success: false, message: `Error checking page_assignments table: ${assignmentsError.message}` };
      }
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
