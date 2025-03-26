
import { supabase } from '../../supabase';

/**
 * Creates the page_analytics table if it doesn't exist
 */
export const initializePageAnalyticsTable = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Creating page_analytics table...');
    
    // Check if the table already exists
    const { error: checkError } = await supabase
      .from('page_analytics')
      .select('id')
      .limit(1);
    
    if (checkError) {
      if (checkError.code === '42P01') { // Table doesn't exist code
        console.log('Table page_analytics does not exist, creating it...');
        
        // Create the table with direct SQL query
        const { error: createTableError } = await supabase.sql(`
          CREATE TABLE IF NOT EXISTS public.page_analytics (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            page_id TEXT NOT NULL,
            view_count INT NOT NULL DEFAULT 0,
            unique_visitors INT NOT NULL DEFAULT 0,
            avg_time_on_page FLOAT,
            bounce_rate FLOAT,
            last_viewed_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(page_id)
          );
          
          -- RLS policies for page_analytics
          ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;
          
          -- Create admin view policy
          CREATE POLICY "Admins can view all analytics" 
            ON public.page_analytics FOR SELECT 
            USING (
              EXISTS (
                SELECT 1 FROM public.user_profiles 
                WHERE id = auth.uid() AND role = 'admin'
              )
            );
          
          -- Create editor view policy
          CREATE POLICY "Editors can view analytics for assigned pages" 
            ON public.page_analytics FOR SELECT 
            USING (
              EXISTS (
                SELECT 1 FROM public.page_assignments 
                WHERE page_id = page_analytics.page_id 
                AND user_id = auth.uid()
              )
            );
          
          -- Create service role policy for tracking
          CREATE POLICY "Service role can update analytics" 
            ON public.page_analytics FOR ALL
            USING (auth.uid() IS NOT NULL);
        `);
        
        if (createTableError) {
          console.error('Error creating page_analytics table:', createTableError);
          return { success: false, message: `Error creating page_analytics table: ${createTableError.message}` };
        }
      } else {
        console.error('Error checking page_analytics table:', checkError);
        return { success: false, message: `Error checking page_analytics table: ${checkError.message}` };
      }
    } else {
      console.log('page_analytics table already exists');
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
