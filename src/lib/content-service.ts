
import { supabase } from './supabase';

export type PageContent = {
  id?: string;
  page_path: string;
  content_data: Record<string, string>;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  version?: number;
  status?: 'draft' | 'published' | 'archived';
  published_at?: string;
  published_by?: string;
};

export type ContentExport = {
  version: number;
  timestamp: string;
  pageUrl: string;
  content: Record<string, string>;
  status?: 'draft' | 'published' | 'archived';
};

// Get page content from Supabase - now with status filtering
export const getPageContent = async (
  pagePath: string, 
  status: 'draft' | 'published' | 'any' = 'published'
): Promise<Record<string, string> | null> => {
  try {
    let query = supabase
      .from('page_content')
      .select('content_data, status')
      .eq('page_path', pagePath);
    
    // Filter by status if not 'any'
    if (status !== 'any') {
      query = query.eq('status', status);
    }
    
    // Get latest version
    query = query.order('version', { ascending: false }).limit(1);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // If no data with the specified status, try to get published content
    if (!data || data.length === 0) {
      if (status === 'draft') {
        console.log('No draft found, fetching published version');
        return getPageContent(pagePath, 'published');
      }
      return null;
    }
    
    console.log(`Retrieved ${data[0].status} content for page: ${pagePath}`);
    return data[0].content_data || null;
  } catch (error) {
    console.error('Error fetching page content:', error);
    throw error;
  }
};

// Save page content to Supabase with versioning and status
export const savePageContent = async (
  pagePath: string, 
  contentData: Record<string, string>,
  userId?: string,
  status: 'draft' | 'published' = 'published'  // Default to published for backward compatibility
): Promise<PageContent> => {
  console.log(`Saving ${status} content for page: ${pagePath}`);
  
  try {
    // First check if content for this page already exists
    const { data: existingVersions } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_path', pagePath)
      .order('version', { ascending: false })
      .limit(1);
    
    const latestVersion = existingVersions && existingVersions.length > 0 
      ? existingVersions[0] 
      : null;
    
    const newVersion = latestVersion ? (latestVersion.version || 0) + 1 : 1;
    console.log(`Creating new version: ${newVersion} with status: ${status}`);
    
    // Always create a new version - this gives us full version history
    const timestamp = new Date().toISOString();
    const newContent: PageContent = {
      page_path: pagePath,
      content_data: contentData,
      created_by: userId,
      version: newVersion,
      status: status,
      created_at: timestamp,
      updated_at: timestamp,
    };
    
    // Add publishing info if status is 'published'
    if (status === 'published') {
      newContent.published_at = timestamp;
      newContent.published_by = userId;
    }
    
    // Insert new version
    const { data, error } = await supabase
      .from('page_content')
      .insert(newContent)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving page content:', error);
      throw error;
    }
    
    console.log(`Successfully saved ${status} content for page: ${pagePath}`);
    return data;
  } catch (error) {
    console.error('Error in savePageContent:', error);
    throw error;
  }
};

// Get all versions of a page's content
export const getPageVersions = async (pagePath: string): Promise<PageContent[]> => {
  try {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_path', pagePath)
      .order('version', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching page versions:', error);
    return [];
  }
};

// Get a specific version of page content
export const getPageVersion = async (
  pagePath: string, 
  version: number
): Promise<PageContent | null> => {
  try {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_path', pagePath)
      .eq('version', version)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching page version:', error);
    return null;
  }
};

// Publish a draft version
export const publishPageContent = async (
  pagePath: string,
  version: number,
  userId?: string
): Promise<boolean> => {
  try {
    // Get the specific version
    const { data: versionData, error: versionError } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_path', pagePath)
      .eq('version', version)
      .single();
    
    if (versionError || !versionData) {
      console.error('Error fetching version to publish:', versionError);
      return false;
    }
    
    // Create a new published version
    const result = await savePageContent(
      pagePath,
      versionData.content_data,
      userId,
      'published'
    );
    
    return !!result;
  } catch (error) {
    console.error('Error publishing page content:', error);
    return false;
  }
};

// Get all pages content for admin
export const getAllPagesContent = async (
  status: 'draft' | 'published' | 'archived' | 'any' = 'any'
): Promise<PageContent[]> => {
  try {
    let query = supabase
      .from('page_content')
      .select('*');
    
    // Filter by status if not 'any'
    if (status !== 'any') {
      query = query.eq('status', status);
    }
    
    // Get the latest version of each page
    const { data, error } = await query.order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    // Group by page_path and take only the latest version
    const latestVersions = new Map<string, PageContent>();
    data?.forEach(item => {
      const existingItem = latestVersions.get(item.page_path);
      if (!existingItem || (item.version && existingItem.version && item.version > existingItem.version)) {
        latestVersions.set(item.page_path, item);
      }
    });
    
    return Array.from(latestVersions.values());
  } catch (error) {
    console.error('Error fetching all pages content:', error);
    return [];
  }
};

// Import content from a JSON file
export const importPageContent = async (
  importData: ContentExport, 
  userId?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Validate the import data
    if (!importData || !importData.version || !importData.pageUrl || !importData.content) {
      return { 
        success: false, 
        message: 'Invalid import file format. Missing required fields.' 
      };
    }
    
    // Default status to published if not specified
    const status = importData.status || 'published';
    
    // Save the imported content
    await savePageContent(
      importData.pageUrl,
      importData.content,
      userId,
      status as 'draft' | 'published'
    );
    
    return { 
      success: true, 
      message: `Content successfully imported for page: ${importData.pageUrl} as ${status}` 
    };
  } catch (error: any) {
    console.error('Error importing content:', error);
    return { 
      success: false, 
      message: error.message || 'An error occurred during import' 
    };
  }
};

// Validate content export format
export const validateContentImport = (jsonData: any): { 
  valid: boolean; 
  data?: ContentExport; 
  error?: string 
} => {
  try {
    // If string was passed, try to parse it
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    // Check required fields
    if (!data.version || !data.timestamp || !data.pageUrl || !data.content) {
      return { 
        valid: false, 
        error: 'Invalid import format: missing required fields' 
      };
    }
    
    // Check if content is an object
    if (typeof data.content !== 'object' || data.content === null) {
      return {
        valid: false,
        error: 'Invalid content format: content must be an object'
      };
    }
    
    // Validate status if present
    if (data.status && !['draft', 'published', 'archived'].includes(data.status)) {
      return {
        valid: false,
        error: 'Invalid status: must be draft, published, or archived'
      };
    }
    
    return { valid: true, data: data as ContentExport };
  } catch (error: any) {
    return { 
      valid: false, 
      error: error.message || 'Invalid JSON format' 
    };
  }
};
