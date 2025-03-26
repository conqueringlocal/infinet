
import { supabase } from '../supabase';

/**
 * Creates a default admin user
 */
export const createDefaultAdminUser = async (
  email: string = 'admin@example.com',
  password: string = 'admin123'
): Promise<{ success: boolean; message: string; userId?: string }> => {
  try {
    console.log(`Creating default admin user with email: ${email}`);
    
    // Step 1: Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) {
      // Check if the error is because the user already exists
      if (authError.message.includes('already registered')) {
        console.log('User already exists, trying to sign in...');
        
        // Try to sign in instead
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          console.error('Error signing in existing user:', signInError);
          return { 
            success: false, 
            message: `Error signing in: ${signInError.message}` 
          };
        }
        
        // Use the existing user's ID
        if (!signInData.user) {
          return { 
            success: false, 
            message: 'Failed to get user data after sign in' 
          };
        }
        
        const userId = signInData.user.id;
        
        // Step 2: Use direct SQL to insert or update the admin user bypassing RLS
        // Since this is an initial setup function, we can use the service role client
        try {
          // Create the admin user using direct SQL (bypassing RLS)
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gqcfneuiruffgpwhkecy.supabase.co';
          const apiKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
          
          // Use the function API to run server-side with service role permissions
          const { error: upsertError } = await supabase.rpc('create_admin_user', {
            user_id: userId,
            user_email: email
          });
          
          if (upsertError) {
            console.error('Error using RPC function:', upsertError);
            console.log('Attempting direct upsert as fallback...');
            
            // Try direct profile check and update as fallback
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('id, role')
              .eq('id', userId)
              .maybeSingle();
            
            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Error checking user profile:', profileError);
            }
            
            // If profile exists but is not admin, try to update directly
            if (profileData && profileData.role !== 'admin') {
              console.log('User exists but is not admin, updating...');
              return { 
                success: true, 
                message: 'User exists but could not update to admin role due to RLS. Please update manually in Supabase.',
                userId 
              };
            } else if (!profileData) {
              console.log('Profile does not exist, instructing manual creation...');
              return { 
                success: true, 
                message: 'Auth user created, but could not create admin profile due to RLS. Please create the profile manually in Supabase.',
                userId 
              };
            }
            
            return { 
              success: true, 
              message: 'User already exists and has admin role.',
              userId 
            };
          }
          
          return { 
            success: true, 
            message: 'Admin user setup completed successfully.',
            userId
          };
        } catch (error) {
          console.error('Error during admin profile setup:', error);
          return { 
            success: true, 
            message: 'Auth user available, but manual profile setup may be required. Check Supabase dashboard.',
            userId 
          };
        }
      }
      
      console.error('Error creating admin user:', authError);
      return { 
        success: false, 
        message: `Error creating user: ${authError.message}` 
      };
    }
    
    if (!authData.user) {
      return { 
        success: false, 
        message: 'Failed to get user data after sign up' 
      };
    }
    
    const userId = authData.user.id;
    console.log(`User created with ID: ${userId}`);
    
    // Step 2: Use direct SQL or RPC to add the admin profile (bypassing RLS)
    try {
      // Create the admin user using RPC function (bypassing RLS)
      const { error: upsertError } = await supabase.rpc('create_admin_user', {
        user_id: userId,
        user_email: email
      });
      
      if (upsertError) {
        console.error('Error using RPC function:', upsertError);
        return {
          success: true,
          message: 'Auth user created, but could not create admin profile due to RLS. Use the SQL in the manual tab to set up the create_admin_user function.',
          userId
        };
      }
      
      return {
        success: true,
        message: 'Admin user created successfully',
        userId
      };
    } catch (error) {
      console.error('Error during admin profile creation:', error);
      return { 
        success: true, 
        message: 'Auth user created, but manual profile setup required. See instructions.',
        userId 
      };
    }
  } catch (error) {
    console.error('Error creating default admin user:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error creating admin user' 
    };
  }
};
