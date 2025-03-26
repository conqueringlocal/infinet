
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
        
        // Check if the user profile exists
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', userId)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') { // Not found
          console.error('Error checking if user profile exists:', profileError);
          return { 
            success: false, 
            message: `Error checking user profile: ${profileError.message}` 
          };
        }
        
        // If profile exists and is not admin, update it
        if (profileData && profileData.role !== 'admin') {
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({ role: 'admin' })
            .eq('id', userId);
          
          if (updateError) {
            console.error('Error updating user role to admin:', updateError);
            return { 
              success: false, 
              message: `Error updating user role: ${updateError.message}` 
            };
          }
          
          return { 
            success: true, 
            message: 'Existing user updated to admin role',
            userId 
          };
        } 
        // If profile doesn't exist, create it
        else if (!profileData) {
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              id: userId,
              email,
              role: 'admin',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          
          if (insertError) {
            console.error('Error creating admin user profile:', insertError);
            return { 
              success: false, 
              message: `Error creating user profile: ${insertError.message}` 
            };
          }
          
          return { 
            success: true, 
            message: 'Admin user profile created for existing user',
            userId 
          };
        }
        
        return { 
          success: true, 
          message: 'User already exists with admin role',
          userId 
        };
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
    
    // Step 2: Add the user profile with admin role
    try {
      // First check if the user_profiles table exists
      const { error: tableCheckError } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
      
      if (tableCheckError && tableCheckError.code === '42P01') {
        console.warn('user_profiles table does not exist yet, user will be created by the trigger');
        return { 
          success: true, 
          message: 'Admin user created. Note: user_profiles table does not exist yet, so profile will be created when table is created',
          userId 
        };
      }
      
      // Insert the admin user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          email,
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      
      if (profileError) {
        console.error('Error creating admin user profile:', profileError);
        return { 
          success: false, 
          message: `Error creating user profile: ${profileError.message}` 
        };
      }
    } catch (profileInsertError) {
      console.warn('Error during profile insertion, may be due to missing table:', profileInsertError);
      // Continue without failing since the user was created
    }
    
    return {
      success: true,
      message: 'Admin user created successfully',
      userId
    };
  } catch (error) {
    console.error('Error creating default admin user:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error creating admin user' 
    };
  }
};
