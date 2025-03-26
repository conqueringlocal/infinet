
import { supabase } from './supabase';

/**
 * Creates all the necessary database tables if they don't exist
 */
export const initializeDatabase = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Initializing database...');
    
    // Check if required tables exist
    const { data: existingTables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Error checking existing tables:', tablesError);
      return { success: false, message: 'Error checking database tables' };
    }
    
    const existingTableNames = existingTables?.map(t => t.table_name) || [];
    
    // Create user_profiles table if it doesn't exist
    if (!existingTableNames.includes('user_profiles')) {
      console.log('Creating user_profiles table...');
      const { error: profilesError } = await supabase.rpc('create_user_profiles_table');
      
      if (profilesError) {
        // Try direct SQL if RPC fails
        const { error: sqlError } = await supabase.rpc('execute_sql', {
          sql_query: `
            CREATE TABLE IF NOT EXISTS public.user_profiles (
              id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
            CREATE POLICY "Users can view all profiles" 
              ON public.user_profiles FOR SELECT 
              USING (true);
            
            -- Users can update their own profile
            CREATE POLICY "Users can update own profile" 
              ON public.user_profiles FOR UPDATE 
              USING (auth.uid() = id);
            
            -- Only admins can update other profiles
            CREATE POLICY "Admins can update any profile" 
              ON public.user_profiles FOR UPDATE 
              USING (
                EXISTS (
                  SELECT 1 FROM public.user_profiles 
                  WHERE id = auth.uid() AND role = 'admin'
                )
              );
          `
        });
        
        if (sqlError) {
          console.error('Error creating user_profiles table:', sqlError);
          return { success: false, message: 'Error creating user_profiles table' };
        }
      }
    }
    
    // Create page_assignments table if it doesn't exist
    if (!existingTableNames.includes('page_assignments')) {
      console.log('Creating page_assignments table...');
      const { error: assignmentsError } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS public.page_assignments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
            page_path TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, page_path)
          );
          
          -- RLS policies for page_assignments
          ALTER TABLE public.page_assignments ENABLE ROW LEVEL SECURITY;
          
          -- Users can view their own assignments
          CREATE POLICY "Users can view own assignments" 
            ON public.page_assignments FOR SELECT 
            USING (auth.uid() = user_id);
          
          -- Allow admins and editors to view all assignments
          CREATE POLICY "Admins and editors can view all assignments" 
            ON public.page_assignments FOR SELECT 
            USING (
              EXISTS (
                SELECT 1 FROM public.user_profiles 
                WHERE id = auth.uid() AND role IN ('admin', 'editor')
              )
            );
          
          -- Only admins can modify assignments
          CREATE POLICY "Only admins can modify assignments" 
            ON public.page_assignments 
            USING (
              EXISTS (
                SELECT 1 FROM public.user_profiles 
                WHERE id = auth.uid() AND role = 'admin'
              )
            );
        `
      });
      
      if (assignmentsError) {
        console.error('Error creating page_assignments table:', assignmentsError);
        return { success: false, message: 'Error creating page_assignments table' };
      }
    }
    
    // Create page_content table if it doesn't exist
    if (!existingTableNames.includes('page_content')) {
      console.log('Creating page_content table...');
      const { error: contentError } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS public.page_content (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            page_path TEXT NOT NULL,
            content JSONB NOT NULL,
            created_by UUID REFERENCES public.user_profiles(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            published BOOLEAN DEFAULT false,
            version INT DEFAULT 1,
            UNIQUE(page_path, version)
          );
          
          -- RLS policies for page_content
          ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
          
          -- Anyone can view published content
          CREATE POLICY "Anyone can view published content" 
            ON public.page_content FOR SELECT 
            USING (published = true);
          
          -- Users with edit_content permission can view all content
          CREATE POLICY "Editors can view all content" 
            ON public.page_content FOR SELECT 
            USING (
              EXISTS (
                SELECT 1 FROM public.user_profiles 
                WHERE id = auth.uid() AND role IN ('admin', 'editor', 'contributor')
              )
            );
          
          -- Only users with publish_content permission can publish
          CREATE POLICY "Only editors and admins can publish" 
            ON public.page_content FOR UPDATE 
            USING (
              EXISTS (
                SELECT 1 FROM public.user_profiles 
                WHERE id = auth.uid() AND role IN ('admin', 'editor')
              )
            );
          
          -- Contributors can create and update their own content
          CREATE POLICY "Contributors can create and update their content" 
            ON public.page_content 
            USING (
              EXISTS (
                SELECT 1 FROM public.user_profiles 
                WHERE id = auth.uid() AND role IN ('admin', 'editor', 'contributor')
              )
            );
        `
      });
      
      if (contentError) {
        console.error('Error creating page_content table:', contentError);
        return { success: false, message: 'Error creating page_content table' };
      }
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
    console.log('Checking for existing admin user...');
    
    // Check if the admin user already exists
    const { data: existingUser, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (userError) {
      console.error('Error checking for existing admin:', userError);
      return { success: false, message: 'Error checking for existing admin user' };
    }
    
    if (existingUser) {
      console.log('Admin user already exists');
      return { success: true, message: 'Admin user already exists' };
    }
    
    // Create the admin user in auth
    console.log('Creating admin user...');
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
      console.error('Error creating admin auth user:', authError);
      return { success: false, message: `Error creating admin auth user: ${authError.message}` };
    }
    
    if (!authData.user) {
      return { success: false, message: 'Failed to create admin user' };
    }
    
    // Create the admin profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email,
        display_name: displayName,
        full_name: 'Site Administrator',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
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
