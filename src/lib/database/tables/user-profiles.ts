
import { supabase } from '../../supabase';

/**
 * Creates the user_profiles table if it doesn't exist
 */
export const initializeUserProfilesTable = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Creating user_profiles table...');
    
    const { error: userProfilesError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (userProfilesError) {
      if (userProfilesError.code === '42P01') { // Table doesn't exist
        console.log('Table user_profiles does not exist, creating it...');
        
        // Create table with raw query using rpc
        const { error: createTableError } = await supabase.rpc('execute_sql', {
          query: `
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
          `
        });
        
        if (createTableError) {
          console.error('Error creating user_profiles table:', createTableError);
          return { success: false, message: `Error creating user_profiles table: ${createTableError.message}` };
        }
        
        // Create policies
        const { error: viewPolicyError } = await supabase.rpc('execute_sql', {
          query: `
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can view all profiles'
              ) THEN
                CREATE POLICY "Users can view all profiles" 
                  ON public.user_profiles FOR SELECT 
                  USING (true);
              END IF;
            END
            $$;
          `
        });
        
        if (viewPolicyError) {
          console.error('Error creating view policy:', viewPolicyError);
        }
        
        const { error: updatePolicyError } = await supabase.rpc('execute_sql', {
          query: `
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can update own profile'
              ) THEN
                CREATE POLICY "Users can update own profile" 
                  ON public.user_profiles FOR UPDATE 
                  USING (auth.uid() = id);
              END IF;
            END
            $$;
          `
        });
        
        if (updatePolicyError) {
          console.error('Error creating update policy:', updatePolicyError);
        }
        
        const { error: adminPolicyError } = await supabase.rpc('execute_sql', {
          query: `
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Admins can update any profile'
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
        
        if (adminPolicyError) {
          console.error('Error creating admin policy:', adminPolicyError);
        }
      } else {
        console.error('Error checking user_profiles table:', userProfilesError);
        return { success: false, message: `Error checking user_profiles table: ${userProfilesError.message}` };
      }
    }
    
    return { success: true, message: 'User profiles table initialized successfully' };
  } catch (error) {
    console.error('Error initializing user_profiles table:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error initializing user_profiles table' 
    };
  }
};
