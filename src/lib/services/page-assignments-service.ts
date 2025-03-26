
import { supabase } from '../supabase';

// Assign a user to a specific page (admin function)
export const assignUserToPage = async (
  userId: string,
  pageId: string,
  role: string = 'editor'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('page_assignments')
      .insert({
        user_id: userId,
        page_id: pageId,
        role: role,
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
  pageId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('page_assignments')
      .delete()
      .match({ user_id: userId, page_id: pageId });
    
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
      .select('page_id')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data.map(item => item.page_id);
  } catch (error) {
    console.error('Error in getUserPageAssignments:', error);
    return [];
  }
};

// Check if a user is assigned to a specific page
export const isUserAssignedToPage = async (
  userId: string,
  pageId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('page_assignments')
      .select('id')
      .eq('user_id', userId)
      .eq('page_id', pageId)
      .single();
    
    if (error) return false;
    return !!data;
  } catch (error) {
    console.error('Error in isUserAssignedToPage:', error);
    return false;
  }
};

// Get the user's role for a specific page
export const getUserPageRole = async (
  userId: string,
  pageId: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('page_assignments')
      .select('role')
      .eq('user_id', userId)
      .eq('page_id', pageId)
      .single();
    
    if (error) return null;
    return data.role;
  } catch (error) {
    console.error('Error in getUserPageRole:', error);
    return null;
  }
};
