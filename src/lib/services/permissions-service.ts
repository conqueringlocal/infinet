
import { supabase } from '../supabase';
import { Permission, UserProfile } from '../types/user-types';
import { getCurrentUserProfile } from './user-profile-service';

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
        // Only admin can manage users, but we already checked for admin above
        return false;
      
      case 'edit_content':
        return ['admin', 'editor', 'contributor'].includes(profile.role);
      
      case 'publish_content':
        return ['admin', 'editor'].includes(profile.role);
      
      case 'view_content':
        return true; // All authenticated users can view content
      
      case 'manage_media':
        return ['admin', 'editor'].includes(profile.role);
      
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
