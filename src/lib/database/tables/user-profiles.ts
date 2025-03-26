
import { supabase } from '../../supabase';

/**
 * Creates the user_profiles table if it doesn't exist
 */
export const initializeUserProfilesTable = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Creating user_profiles table...');
    
    // Check if the table already exists
    const { error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (checkError) {
      if (checkError.code === '42P01') { // Table doesn't exist code
        console.log('Table user_profiles does not exist, creating it...');
        
        // Create the table with direct SQL query
        const { error: createTableError } = await supabase.sql(`
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
          
          -- Create view policy
          CREATE POLICY "Users can view all profiles" 
            ON public.user_profiles FOR SELECT 
            USING (true);
          
          -- Create update policy
          CREATE POLICY "Users can update own profile" 
            ON public.user_profiles FOR UPDATE 
            USING (auth.uid() = id);
          
          -- Create admin policy
          CREATE POLICY "Admins can update any profile" 
            ON public.user_profiles FOR UPDATE 
            USING (
              EXISTS (
                SELECT 1 FROM public.user_profiles 
                WHERE id = auth.uid() AND role = 'admin'
              )
            );
        `);
        
        if (createTableError) {
          console.error('Error creating user_profiles table:', createTableError);
          return { success: false, message: `Error creating user_profiles table: ${createTableError.message}` };
        }
      } else {
        console.error('Error checking user_profiles table:', checkError);
        return { success: false, message: `Error checking user_profiles table: ${checkError.message}` };
      }
    } else {
      console.log('user_profiles table already exists');
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
