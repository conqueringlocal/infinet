
import { supabase } from '../../supabase';

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
        
        // Create the table with direct SQL query
        const { error: createTableError } = await supabase.sql(`
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
        `);
        
        if (createTableError) {
          console.error('Error creating page_content table:', createTableError);
          return { success: false, message: `Error creating page_content table: ${createTableError.message}` };
        }
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
