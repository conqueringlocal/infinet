
import { supabase } from './supabase';

/**
 * Creates all the necessary database tables if they don't exist
 */
export const initializeDatabase = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Initializing database...');
    
    // Instead of checking existing tables, we'll try to create them directly
    // and handle any errors that occur
    
    console.log('Creating user_profiles table...');
    const { error: profilesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.user_profiles (
          id UUID PRIMARY KEY,
          email TEXT NOT NULL,
          display_name TEXT,
          full_name TEXT,
          role TEXT NOT NULL DEFAULT 'viewer',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          avatar_url TEXT,
          bio TEXT,
          settings JSONB
        );
        
        -- RLS policies for user_profiles
        ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
        
        -- Allow users to see all profiles
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'user_profiles' AND policyname = 'Users can view all profiles'
          ) THEN
            CREATE POLICY "Users can view all profiles" 
              ON public.user_profiles FOR SELECT 
              USING (true);
          END IF;
        END
        $$;
        
        -- Users can update their own profile
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'user_profiles' AND policyname = 'Users can update own profile'
          ) THEN
            CREATE POLICY "Users can update own profile" 
              ON public.user_profiles FOR UPDATE 
              USING (auth.uid() = id);
          END IF;
        END
        $$;
        
        -- Only admins can update other profiles
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'user_profiles' AND policyname = 'Admins can update any profile'
          ) THEN
            CREATE POLICY "Admins can update any profile" 
              ON public.user_profiles FOR UPDATE 
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
    
    if (profilesError) {
      console.error('Error creating user_profiles table:', profilesError);
      return { success: false, message: `Error creating user_profiles table: ${profilesError.message}` };
    }
    
    console.log('Creating page_assignments table...');
    const { error: assignmentsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.page_assignments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          page_path TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, page_path)
        );
        
        -- Add foreign key if it doesn't exist
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'page_assignments_user_id_fkey'
          ) THEN
            ALTER TABLE public.page_assignments 
            ADD CONSTRAINT page_assignments_user_id_fkey 
            FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;
          END IF;
        END
        $$;
        
        -- RLS policies for page_assignments
        ALTER TABLE public.page_assignments ENABLE ROW LEVEL SECURITY;
        
        -- Users can view their own assignments
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'page_assignments' AND policyname = 'Users can view own assignments'
          ) THEN
            CREATE POLICY "Users can view own assignments" 
              ON public.page_assignments FOR SELECT 
              USING (auth.uid() = user_id);
          END IF;
        END
        $$;
        
        -- Allow admins and editors to view all assignments
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'page_assignments' AND policyname = 'Admins and editors can view all assignments'
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
        
        -- Only admins can modify assignments
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'page_assignments' AND policyname = 'Only admins can modify assignments'
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
    
    if (assignmentsError) {
      console.error('Error creating page_assignments table:', assignmentsError);
      return { success: false, message: `Error creating page_assignments table: ${assignmentsError.message}` };
    }
    
    console.log('Creating page_content table...');
    const { error: contentError } = await supabase.rpc('execute_sql', {
      sql_query: `
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
        
        -- Add foreign key if it doesn't exist
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'page_content_created_by_fkey'
          ) THEN
            ALTER TABLE public.page_content 
            ADD CONSTRAINT page_content_created_by_fkey 
            FOREIGN KEY (created_by) REFERENCES public.user_profiles(id);
          END IF;
        END
        $$;
        
        -- RLS policies for page_content
        ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
        
        -- Anyone can view published content
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'page_content' AND policyname = 'Anyone can view published content'
          ) THEN
            CREATE POLICY "Anyone can view published content" 
              ON public.page_content FOR SELECT 
              USING (published = true);
          END IF;
        END
        $$;
        
        -- Users with edit_content permission can view all content
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'page_content' AND policyname = 'Editors can view all content'
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
        
        -- Only users with publish_content permission can publish
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'page_content' AND policyname = 'Only editors and admins can publish'
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
        
        -- Contributors can create and update their own content
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'page_content' AND policyname = 'Contributors can create and update their content'
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
    
    if (contentError) {
      console.error('Error creating page_content table:', contentError);
      return { success: false, message: `Error creating page_content table: ${contentError.message}` };
    }
    
    // Create page_analytics table for visitor tracking
    console.log('Creating page_analytics table...');
    const { error: analyticsError } = await supabase.rpc('execute_sql', {
      sql_query: `
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
        
        -- Anyone can insert analytics
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'page_analytics' AND policyname = 'Anyone can insert analytics'
          ) THEN
            CREATE POLICY "Anyone can insert analytics" 
              ON public.page_analytics FOR INSERT 
              WITH CHECK (true);
          END IF;
        END
        $$;
        
        -- Only admins can view analytics
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'page_analytics' AND policyname = 'Only admins can view analytics'
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
    
    if (analyticsError) {
      console.error('Error creating page_analytics table:', analyticsError);
      return { success: false, message: `Error creating page_analytics table: ${analyticsError.message}` };
    }
    
    console.log('Database initialized successfully!');
    return { success: true, message: 'Database initialized successfully' };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown database initialization error' 
    };
  }
};

/**
 * Creates a default admin user if it doesn't exist
 */
export const createDefaultAdminUser = async (
  email: string = 'admin@example.com',
  password: string = 'admin123',
  displayName: string = 'Administrator'
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Creating admin user...');
    
    // Directly create the admin user in auth without checking for existing admin
    // If it fails because user exists, we'll handle that in the catch block
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin',
          display_name: displayName
        }
      }
    });
    
    if (authError) {
      // Check if error is because user already exists
      if (authError.message.includes('already exists')) {
        console.log('Admin user already exists');
        return { success: true, message: 'Admin user already exists' };
      }
      
      console.error('Error creating admin auth user:', authError);
      return { success: false, message: `Error creating admin user: ${authError.message}` };
    }
    
    if (!authData.user) {
      return { success: false, message: 'Failed to create admin user' };
    }
    
    // Create the admin profile - using upsert to handle the case where the profile already exists
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: authData.user.id,
        email,
        display_name: displayName,
        full_name: 'Site Administrator',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    
    if (profileError) {
      console.error('Error creating admin profile:', profileError);
      return { success: false, message: `Error creating admin profile: ${profileError.message}` };
    }
    
    console.log('Default admin user created successfully!');
    return { 
      success: true, 
      message: `Admin user created! Email: ${email}, Password: ${password}` 
    };
  } catch (error) {
    console.error('Error creating default admin:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error creating admin user' 
    };
  }
};

/**
 * Performs a complete CMS setup
 */
export const setupCMS = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Initialize the database
    const dbResult = await initializeDatabase();
    if (!dbResult.success) {
      return dbResult;
    }
    
    // Create the default admin user
    const adminResult = await createDefaultAdminUser();
    if (!adminResult.success) {
      return adminResult;
    }
    
    return {
      success: true,
      message: `CMS setup complete! ${adminResult.message}`
    };
  } catch (error) {
    console.error('Error setting up CMS:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error during CMS setup'
    };
  }
};
