
import { supabase } from './supabase';

/**
 * Creates all the necessary database tables if they don't exist
 */
export const initializeDatabase = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Initializing database...');
    
    // Create user_profiles table
    console.log('Creating user_profiles table...');
    const { error: userProfilesError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (userProfilesError) {
      if (userProfilesError.code === '42P01') { // Table doesn't exist
        console.log('Table user_profiles does not exist, creating it...');
        
        const { error: createTableError } = await supabase
          .query(`
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
          `);
        
        if (createTableError) {
          console.error('Error creating user_profiles table:', createTableError);
          return { success: false, message: `Error creating user_profiles table: ${createTableError.message}` };
        }
        
        // Create policies one at a time
        const { error: viewPolicyError } = await supabase
          .query(`
            CREATE POLICY "Users can view all profiles" 
              ON public.user_profiles FOR SELECT 
              USING (true);
          `);
        
        if (viewPolicyError) {
          console.error('Error creating view policy:', viewPolicyError);
          // Continue even if policy creation fails, as the table is more important
        }
        
        const { error: updatePolicyError } = await supabase
          .query(`
            CREATE POLICY "Users can update own profile" 
              ON public.user_profiles FOR UPDATE 
              USING (auth.uid() = id);
          `);
        
        if (updatePolicyError) {
          console.error('Error creating update policy:', updatePolicyError);
        }
        
        const { error: adminPolicyError } = await supabase
          .query(`
            CREATE POLICY "Admins can update any profile" 
              ON public.user_profiles FOR UPDATE 
              USING (
                EXISTS (
                  SELECT 1 FROM public.user_profiles 
                  WHERE id = auth.uid() AND role = 'admin'
                )
              );
          `);
        
        if (adminPolicyError) {
          console.error('Error creating admin policy:', adminPolicyError);
        }
      } else {
        console.error('Error checking user_profiles table:', userProfilesError);
        return { success: false, message: `Error checking user_profiles table: ${userProfilesError.message}` };
      }
    }
    
    // Create page_assignments table
    console.log('Creating page_assignments table...');
    const { error: assignmentsError } = await supabase
      .from('page_assignments')
      .select('id')
      .limit(1);
    
    if (assignmentsError) {
      if (assignmentsError.code === '42P01') { // Table doesn't exist
        console.log('Table page_assignments does not exist, creating it...');
        
        const { error: createTableError } = await supabase
          .query(`
            CREATE TABLE IF NOT EXISTS public.page_assignments (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID NOT NULL,
              page_path TEXT NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              UNIQUE(user_id, page_path)
            );
          `);
        
        if (createTableError) {
          console.error('Error creating page_assignments table:', createTableError);
          return { success: false, message: `Error creating page_assignments table: ${createTableError.message}` };
        }
        
        // Add foreign key constraint
        const { error: foreignKeyError } = await supabase
          .query(`
            ALTER TABLE public.page_assignments 
            ADD CONSTRAINT page_assignments_user_id_fkey 
            FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;
            
            -- RLS policies for page_assignments
            ALTER TABLE public.page_assignments ENABLE ROW LEVEL SECURITY;
          `);
        
        if (foreignKeyError) {
          console.error('Error adding foreign key constraint:', foreignKeyError);
        }
        
        // Create policies one at a time
        const { error: viewOwnPolicyError } = await supabase
          .query(`
            CREATE POLICY "Users can view own assignments" 
              ON public.page_assignments FOR SELECT 
              USING (auth.uid() = user_id);
          `);
        
        if (viewOwnPolicyError) {
          console.error('Error creating view own policy:', viewOwnPolicyError);
        }
        
        const { error: viewAllPolicyError } = await supabase
          .query(`
            CREATE POLICY "Admins and editors can view all assignments" 
              ON public.page_assignments FOR SELECT 
              USING (
                EXISTS (
                  SELECT 1 FROM public.user_profiles 
                  WHERE id = auth.uid() AND role IN ('admin', 'editor')
                )
              );
          `);
        
        if (viewAllPolicyError) {
          console.error('Error creating view all policy:', viewAllPolicyError);
        }
        
        const { error: modifyPolicyError } = await supabase
          .query(`
            CREATE POLICY "Only admins can modify assignments" 
              ON public.page_assignments 
              USING (
                EXISTS (
                  SELECT 1 FROM public.user_profiles 
                  WHERE id = auth.uid() AND role = 'admin'
                )
              );
          `);
        
        if (modifyPolicyError) {
          console.error('Error creating modify policy:', modifyPolicyError);
        }
      } else {
        console.error('Error checking page_assignments table:', assignmentsError);
        return { success: false, message: `Error checking page_assignments table: ${assignmentsError.message}` };
      }
    }
    
    // Create page_content table
    console.log('Creating page_content table...');
    const { error: contentError } = await supabase
      .from('page_content')
      .select('id')
      .limit(1);
    
    if (contentError) {
      if (contentError.code === '42P01') { // Table doesn't exist
        console.log('Table page_content does not exist, creating it...');
        
        const { error: createTableError } = await supabase
          .query(`
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
          `);
        
        if (createTableError) {
          console.error('Error creating page_content table:', createTableError);
          return { success: false, message: `Error creating page_content table: ${createTableError.message}` };
        }
        
        // Add foreign key constraint
        const { error: foreignKeyError } = await supabase
          .query(`
            ALTER TABLE public.page_content 
            ADD CONSTRAINT page_content_created_by_fkey 
            FOREIGN KEY (created_by) REFERENCES public.user_profiles(id);
            
            -- RLS policies for page_content
            ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
          `);
        
        if (foreignKeyError) {
          console.error('Error adding foreign key constraint:', foreignKeyError);
        }
        
        // Create policies one at a time
        const { error: publishedPolicyError } = await supabase
          .query(`
            CREATE POLICY "Anyone can view published content" 
              ON public.page_content FOR SELECT 
              USING (published = true);
          `);
        
        if (publishedPolicyError) {
          console.error('Error creating published content policy:', publishedPolicyError);
        }
        
        const { error: editorViewPolicyError } = await supabase
          .query(`
            CREATE POLICY "Editors can view all content" 
              ON public.page_content FOR SELECT 
              USING (
                EXISTS (
                  SELECT 1 FROM public.user_profiles 
                  WHERE id = auth.uid() AND role IN ('admin', 'editor', 'contributor')
                )
              );
          `);
        
        if (editorViewPolicyError) {
          console.error('Error creating editor view policy:', editorViewPolicyError);
        }
        
        const { error: publishPolicyError } = await supabase
          .query(`
            CREATE POLICY "Only editors and admins can publish" 
              ON public.page_content FOR UPDATE 
              USING (
                EXISTS (
                  SELECT 1 FROM public.user_profiles 
                  WHERE id = auth.uid() AND role IN ('admin', 'editor')
                )
              );
          `);
        
        if (publishPolicyError) {
          console.error('Error creating publish policy:', publishPolicyError);
        }
        
        const { error: contributorPolicyError } = await supabase
          .query(`
            CREATE POLICY "Contributors can create and update their content" 
              ON public.page_content 
              USING (
                EXISTS (
                  SELECT 1 FROM public.user_profiles 
                  WHERE id = auth.uid() AND role IN ('admin', 'editor', 'contributor')
                )
              );
          `);
        
        if (contributorPolicyError) {
          console.error('Error creating contributor policy:', contributorPolicyError);
        }
      } else {
        console.error('Error checking page_content table:', contentError);
        return { success: false, message: `Error checking page_content table: ${contentError.message}` };
      }
    }
    
    // Create page_analytics table
    console.log('Creating page_analytics table...');
    const { error: analyticsError } = await supabase
      .from('page_analytics')
      .select('id')
      .limit(1);
    
    if (analyticsError) {
      if (analyticsError.code === '42P01') { // Table doesn't exist
        console.log('Table page_analytics does not exist, creating it...');
        
        const { error: createTableError } = await supabase
          .query(`
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
          `);
        
        if (createTableError) {
          console.error('Error creating page_analytics table:', createTableError);
          return { success: false, message: `Error creating page_analytics table: ${createTableError.message}` };
        }
        
        // Create policies one at a time
        const { error: insertPolicyError } = await supabase
          .query(`
            CREATE POLICY "Anyone can insert analytics" 
              ON public.page_analytics FOR INSERT 
              WITH CHECK (true);
          `);
        
        if (insertPolicyError) {
          console.error('Error creating insert policy:', insertPolicyError);
        }
        
        const { error: viewPolicyError } = await supabase
          .query(`
            CREATE POLICY "Only admins can view analytics" 
              ON public.page_analytics FOR SELECT 
              USING (
                EXISTS (
                  SELECT 1 FROM public.user_profiles 
                  WHERE id = auth.uid() AND role = 'admin'
                )
              );
          `);
        
        if (viewPolicyError) {
          console.error('Error creating view policy:', viewPolicyError);
        }
      } else {
        console.error('Error checking page_analytics table:', analyticsError);
        return { success: false, message: `Error checking page_analytics table: ${analyticsError.message}` };
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
