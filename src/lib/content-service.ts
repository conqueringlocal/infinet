
import { supabase } from './supabase';
import { hasPermission } from './services/permissions-service';

export interface ContentExport {
  version: number;
  timestamp: string;
  pageUrl: string;
  content: Record<string, string>;
}

/**
 * Get content for a specific page
 */
export const getPageContent = async (pageId: string): Promise<Record<string, string> | null> => {
  try {
    console.log(`Fetching content for page: ${pageId}`);
    
    // Try to get the latest published version
    const { data: publishedData, error: publishedError } = await supabase
      .from('page_content')
      .select('content_data')
      .eq('page_id', pageId)
      .eq('published', true)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (publishedError) {
      console.error('Error getting published content:', publishedError);
      return null;
    }
    
    if (publishedData) {
      console.log(`Found published content for page: ${pageId}`);
      return publishedData.content_data as Record<string, string>;
    }
    
    // If user has edit permission, try to get the latest draft
    const canEdit = await hasPermission('edit_content');
    
    if (canEdit) {
      const { data: draftData, error: draftError } = await supabase
        .from('page_content')
        .select('content_data')
        .eq('page_id', pageId)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (draftError) {
        console.error('Error getting draft content:', draftError);
        return null;
      }
      
      if (draftData) {
        console.log(`Found draft content for page: ${pageId}`);
        return draftData.content_data as Record<string, string>;
      }
    }
    
    console.log(`No content found for page: ${pageId}`);
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
  pageId: string,
  contentData: Record<string, string>,
  userId?: string
): Promise<boolean> => {
  try {
    console.log(`Saving content for page: ${pageId}`);
    
    // Check if the user can publish content
    const canPublish = await hasPermission('publish_content');
    console.log(`User can publish content: ${canPublish}`);
    
    // Generate a unique content_id for this content
    const contentId = `content_${Date.now()}`;
    
    // Get the latest version number for this page
    const { data: versionData, error: versionError } = await supabase
      .from('page_content')
      .select('version')
      .eq('page_id', pageId)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (versionError) {
      console.error('Error getting version:', versionError);
      throw versionError;
    }
    
    const newVersion = versionData ? versionData.version + 1 : 1;
    console.log(`Creating new version: ${newVersion} for page: ${pageId}`);
    
    // Insert the new version
    const { data, error: insertError } = await supabase
      .from('page_content')
      .insert({
        page_id: pageId,
        content_id: contentId,
        content_type: 'page',
        content_data: contentData,
        created_by: userId,
        updated_by: userId,
        published: canPublish, // Auto-publish if user has permission
        version: newVersion
      })
      .select();
    
    if (insertError) {
      console.error('Error saving content:', insertError);
      throw insertError;
    }
    
    console.log(`Content saved successfully for page: ${pageId}`, data);
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
    
    // Use the page URL as the page ID
    const pageId = pageUrl;
    
    // Save the imported content
    await savePageContent(pageId, content, userId);
    
    return {
      success: true,
      message: `Successfully imported content for "${pageId}"`
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during import';
    return { success: false, message: errorMessage };
  }
};
