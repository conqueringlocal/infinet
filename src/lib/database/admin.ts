
import { supabase } from '../supabase';

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
