
import { supabase } from '../../supabase';

/**
 * Creates the page_analytics table if it doesn't exist
 */
export const initializePageAnalyticsTable = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Creating page_analytics table...');
    
    const { error: analyticsError } = await supabase
      .from('page_analytics')
      .select('id')
      .limit(1);
    
    if (analyticsError) {
      if (analyticsError.code === '42P01') { // Table doesn't exist
        console.log('Table page_analytics does not exist, creating it...');
        
        const { error: createTableError } = await supabase.rpc('execute_sql', {
          query: `
            CREATE TABLE IF NOT EXISTS public.page_analytics (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              page_path TEXT NOT NULL,
              viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              session_id TEXT,
              referrer TEXT,
              user_agent TEXT,
              device_type TEXT
            );
            
            -- RLS policies for page_analytics
            ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;
          `
        });
        
        if (createTableError) {
          console.error('Error creating page_analytics table:', createTableError);
          return { success: false, message: `Error creating page_analytics table: ${createTableError.message}` };
        }
        
        // Create policies one at a time
        const { error: insertPolicyError } = await supabase.rpc('execute_sql', {
          query: `
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_policies WHERE tablename = 'page_analytics' AND policyname = 'Anyone can insert analytics'
              ) THEN
                CREATE POLICY "Anyone can insert analytics" 
                  ON public.page_analytics FOR INSERT 
                  WITH CHECK (true);
              END IF;
            END
            $$;
          `
        });
        
        if (insertPolicyError) {
          console.error('Error creating insert policy:', insertPolicyError);
        }
        
        const { error: viewPolicyError } = await supabase.rpc('execute_sql', {
          query: `
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_policies WHERE tablename = 'page_analytics' AND policyname = 'Only admins can view analytics'
              ) THEN
                CREATE POLICY "Only admins can view analytics" 
                  ON public.page_analytics FOR SELECT 
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
        
        if (viewPolicyError) {
          console.error('Error creating view policy:', viewPolicyError);
        }
      } else {
        console.error('Error checking page_analytics table:', analyticsError);
        return { success: false, message: `Error checking page_analytics table: ${analyticsError.message}` };
      }
    }
    
    return { success: true, message: 'Page analytics table initialized successfully' };
  } catch (error) {
    console.error('Error initializing page_analytics table:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error initializing page_analytics table' 
    };
  }
};
