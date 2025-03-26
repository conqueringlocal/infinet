
import { supabase } from '../../supabase';

/**
 * Creates the page_content table if it doesn't exist
 */
export const initializePageContentTable = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Creating page_content table...');
    
    const { error: contentError } = await supabase
      .from('page_content')
      .select('id')
      .limit(1);
    
    if (contentError) {
      if (contentError.code === '42P01') { // Table doesn't exist
        console.log('Table page_content does not exist, creating it...');
        
        const { error: createTableError } = await supabase.rpc('execute_sql', {
          query: `
            CREATE TABLE IF NOT EXISTS public.page_content (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              page_path TEXT NOT NULL,
              content JSONB NOT NULL,
              created_by UUID,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              published BOOLEAN DEFAULT false,
              version INT DEFAULT 1,
              UNIQUE(page_path, version)
            );
          `
        });
        
        if (createTableError) {
          console.error('Error creating page_content table:', createTableError);
          return { success: false, message: `Error creating page_content table: ${createTableError.message}` };
        }
        
        // Add foreign key constraint
        const { error: foreignKeyError } = await supabase.rpc('execute_sql', {
          query: `
            ALTER TABLE public.page_content 
            ADD CONSTRAINT page_content_created_by_fkey 
            FOREIGN KEY (created_by) REFERENCES public.user_profiles(id);
            
            -- RLS policies for page_content
            ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
          `
        });
        
        if (foreignKeyError) {
          console.error('Error adding foreign key constraint:', foreignKeyError);
        }
        
        // Create policies one at a time
        const { error: publishedPolicyError } = await supabase.rpc('execute_sql', {
          query: `
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_policies WHERE tablename = 'page_content' AND policyname = 'Anyone can view published content'
              ) THEN
                CREATE POLICY "Anyone can view published content" 
                  ON public.page_content FOR SELECT 
                  USING (published = true);
              END IF;
            END
            $$;
          `
        });
        
        if (publishedPolicyError) {
          console.error('Error creating published content policy:', publishedPolicyError);
        }
        
        const { error: editorViewPolicyError } = await supabase.rpc('execute_sql', {
          query: `
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_policies WHERE tablename = 'page_content' AND policyname = 'Editors can view all content'
              ) THEN
                CREATE POLICY "Editors can view all content" 
                  ON public.page_content FOR SELECT 
                  USING (
                    EXISTS (
                      SELECT 1 FROM public.user_profiles 
                      WHERE id = auth.uid() AND role IN ('admin', 'editor', 'contributor')
                    )
                  );
              END IF;
            END
            $$;
          `
        });
        
        if (editorViewPolicyError) {
          console.error('Error creating editor view policy:', editorViewPolicyError);
        }
        
        const { error: publishPolicyError } = await supabase.rpc('execute_sql', {
          query: `
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_policies WHERE tablename = 'page_content' AND policyname = 'Only editors and admins can publish'
              ) THEN
                CREATE POLICY "Only editors and admins can publish" 
                  ON public.page_content FOR UPDATE 
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
        
        if (publishPolicyError) {
          console.error('Error creating publish policy:', publishPolicyError);
        }
        
        const { error: contributorPolicyError } = await supabase.rpc('execute_sql', {
          query: `
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_policies WHERE tablename = 'page_content' AND policyname = 'Contributors can create and update their content'
              ) THEN
                CREATE POLICY "Contributors can create and update their content" 
                  ON public.page_content 
                  USING (
                    EXISTS (
                      SELECT 1 FROM public.user_profiles 
                      WHERE id = auth.uid() AND role IN ('admin', 'editor', 'contributor')
                    )
                  );
              END IF;
            END
            $$;
          `
        });
        
        if (contributorPolicyError) {
          console.error('Error creating contributor policy:', contributorPolicyError);
        }
      } else {
        console.error('Error checking page_content table:', contentError);
        return { success: false, message: `Error checking page_content table: ${contentError.message}` };
      }
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
