
import { supabase } from './supabase';
import { hasPermission } from './user-service';

export interface ContentExport {
  version: number;
  timestamp: string;
  pageUrl: string;
  content: Record<string, string>;
}

/**
 * Get content for a specific page
 */
export const getPageContent = async (pagePath: string): Promise<Record<string, string> | null> => {
  try {
    // Try to get the latest published version
    const { data: publishedData, error: publishedError } = await supabase
      .from('page_content')
      .select('content')
      .eq('page_path', pagePath)
      .eq('published', true)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (publishedError) {
      console.error('Error getting published content:', publishedError);
      return null;
    }
    
    if (publishedData) {
      return publishedData.content as Record<string, string>;
    }
    
    // If user has edit permission, try to get the latest draft
    const canEdit = await hasPermission('edit_content');
    
    if (canEdit) {
      const { data: draftData, error: draftError } = await supabase
        .from('page_content')
        .select('content')
        .eq('page_path', pagePath)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (draftError) {
        console.error('Error getting draft content:', draftError);
        return null;
      }
      
      if (draftData) {
        return draftData.content as Record<string, string>;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error in getPageContent:', error);
    return null;
  }
};

/**
 * Save content for a specific page
 */
export const savePageContent = async (
  pagePath: string,
  content: Record<string, string>,
  userId?: string
): Promise<boolean> => {
  try {
    // Check if the user can publish content
    const canPublish = await hasPermission('publish_content');
    
    // Get the latest version number for this page
    const { data: versionData, error: versionError } = await supabase
      .from('page_content')
      .select('version')
      .eq('page_path', pagePath)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (versionError) {
      console.error('Error getting version:', versionError);
      throw versionError;
    }
    
    const newVersion = versionData ? versionData.version + 1 : 1;
    
    // Insert the new version
    const { error: insertError } = await supabase
      .from('page_content')
      .insert({
        page_path: pagePath,
        content,
        created_by: userId,
        published: canPublish, // Auto-publish if user has permission
        version: newVersion
      });
    
    if (insertError) {
      console.error('Error saving content:', insertError);
      throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error('Error in savePageContent:', error);
    throw error;
  }
};

/**
 * Validate a content import
 */
export const validateContentImport = (jsonData: string): { 
  valid: boolean; 
  error?: string;
  data?: ContentExport;
} => {
  try {
    const data = JSON.parse(jsonData);
    
    // Basic validation
    if (!data.version) {
      return { valid: false, error: 'Missing version' };
    }
    
    if (!data.timestamp) {
      return { valid: false, error: 'Missing timestamp' };
    }
    
    if (!data.pageUrl) {
      return { valid: false, error: 'Missing page URL' };
    }
    
    if (!data.content || typeof data.content !== 'object') {
      return { valid: false, error: 'Invalid content format' };
    }
    
    return { valid: true, data };
  } catch (error) {
    return { valid: false, error: 'Invalid JSON format' };
  }
};

/**
 * Import page content from an export
 */
export const importPageContent = async (
  data: ContentExport,
  userId?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const { pageUrl, content } = data;
    
    if (!pageUrl || !content) {
      return { success: false, message: 'Missing page URL or content' };
    }
    
    // Clean up the path
    let pagePath = pageUrl;
    if (pagePath.startsWith('/')) {
      pagePath = pagePath.slice(1);
    }
    if (pagePath.endsWith('/')) {
      pagePath = pagePath.slice(0, -1);
    }
    if (pagePath === '') {
      pagePath = 'index';
    }
    
    // Save the imported content
    await savePageContent(pagePath, content, userId);
    
    return {
      success: true,
      message: `Successfully imported content for "${pagePath}"`
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during import';
    return { success: false, message: errorMessage };
  }
};
