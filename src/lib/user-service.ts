
import { supabase } from './supabase';
import { UserProfile } from './supabase';

// Get the current user's profile
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data as UserProfile;
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    return null;
  }
};

// Check if current user has editor or admin role
export const hasEditPermission = async (): Promise<boolean> => {
  try {
    const profile = await getCurrentUserProfile();
    return !!profile && (profile.role === 'admin' || profile.role === 'editor');
  } catch (error) {
    console.error('Error checking edit permissions:', error);
    return false;
  }
};

// Create or update a user profile
export const upsertUserProfile = async (
  profile: Partial<UserProfile>
): Promise<UserProfile | null> => {
  try {
    // Ensure we have a user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');
    
    const profileData = {
      id: user.id,
      email: user.email || '',
      ...profile,
      updated_at: new Date().toISOString()
    };
    
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();
    
    let result;
    
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          ...profileData,
          created_at: new Date().toISOString(),
          role: profile.role || 'viewer' // Default role
        })
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    return result as UserProfile;
  } catch (error) {
    console.error('Error in upsertUserProfile:', error);
    return null;
  }
};

// Get all user profiles (admin function)
export const getAllUserProfiles = async (): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as UserProfile[];
  } catch (error) {
    console.error('Error in getAllUserProfiles:', error);
    return [];
  }
};

// Update user role (admin function)
export const updateUserRole = async (
  userId: string, 
  role: 'admin' | 'editor' | 'viewer'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    return false;
  }
};
