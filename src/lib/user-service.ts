import { supabase } from './supabase';

// Enhanced role type
export type UserRole = 'admin' | 'editor' | 'contributor' | 'viewer';

// Permission types for different actions
export type Permission = 'manage_users' | 'edit_content' | 'publish_content' | 'view_content' | 'manage_media';

// User profile interface
export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  full_name?: string; // For compatibility with existing code
  role: UserRole;
  created_at?: string;
  updated_at?: string;
  avatar_url?: string;
  bio?: string;
  settings?: Record<string, any>;
}

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

// Check if current user has specific permission
export const hasPermission = async (permission: Permission): Promise<boolean> => {
  try {
    const profile = await getCurrentUserProfile();
    if (!profile) return false;
    
    // Admin has all permissions
    if (profile.role === 'admin') return true;
    
    // Role-based permissions
    switch (permission) {
      case 'manage_users':
        return profile.role === 'admin';
      
      case 'edit_content': {
        // Fix the type comparison by using a type-safe approach
        return ['admin', 'editor', 'contributor'].includes(profile.role);
      }
      
      case 'publish_content': {
        // Fix the type comparison by using a type-safe approach
        return ['admin', 'editor'].includes(profile.role);
      }
      
      case 'view_content':
        return true; // All authenticated users can view content
      
      case 'manage_media': {
        // Fix the type comparison by using a type-safe approach
        return ['admin', 'editor'].includes(profile.role);
      }
      
      default:
        return false;
    }
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
};

// Legacy function for backward compatibility
export const hasEditPermission = async (): Promise<boolean> => {
  return hasPermission('edit_content');
};

// Check if user has permission to edit a specific page path
export const canEditPage = async (pagePath: string): Promise<boolean> => {
  try {
    // First check general edit permission
    const hasEditPerm = await hasPermission('edit_content');
    if (!hasEditPerm) return false;
    
    const profile = await getCurrentUserProfile();
    if (!profile) return false;
    
    // Admin can edit all pages
    if (profile.role === 'admin') return true;
    
    // For contributors, check if they have access to this specific page
    if (profile.role === 'contributor') {
      // Get contributor page assignments from Supabase
      const { data, error } = await supabase
        .from('page_assignments')
        .select('*')
        .eq('user_id', profile.id)
        .eq('page_path', pagePath);
      
      if (error) {
        console.error('Error checking page assignments:', error);
        return false;
      }
      
      // If contributor has explicit assignment to this page, allow edit
      return data && data.length > 0;
    }
    
    // Editors can edit all content
    return profile.role === 'editor';
  } catch (error) {
    console.error('Error in canEditPage:', error);
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
  role: UserRole
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

// Assign a user to a specific page (admin function)
export const assignUserToPage = async (
  userId: string,
  pagePath: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('page_assignments')
      .insert({
        user_id: userId,
        page_path: pagePath,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error in assignUserToPage:', error);
    return false;
  }
};

// Remove user assignment from a page (admin function)
export const removeUserFromPage = async (
  userId: string,
  pagePath: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('page_assignments')
      .delete()
      .match({ user_id: userId, page_path: pagePath });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error in removeUserFromPage:', error);
    return false;
  }
};

// Get pages assigned to a specific user
export const getUserPageAssignments = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('page_assignments')
      .select('page_path')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data.map(item => item.page_path);
  } catch (error) {
    console.error('Error in getUserPageAssignments:', error);
    return [];
  }
};
