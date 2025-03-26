
import { supabase } from './supabase';

export type PageContent = {
  id?: string;
  page_path: string;
  content_data: Record<string, string>;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  version?: number;
};

export type ContentExport = {
  version: number;
  timestamp: string;
  pageUrl: string;
  content: Record<string, string>;
};

// Save page content to Supabase
export const savePageContent = async (
  pagePath: string, 
  contentData: Record<string, string>,
  userId?: string
): Promise<PageContent> => {
  // First check if content for this page already exists
  const { data: existingContent } = await supabase
    .from('page_content')
    .select('*')
    .eq('page_path', pagePath)
    .maybeSingle();
  
  if (existingContent) {
    // Update existing content
    const { data, error } = await supabase
      .from('page_content')
      .update({
        content_data: contentData,
        updated_at: new Date().toISOString(),
        version: (existingContent.version || 0) + 1
      })
      .eq('id', existingContent.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    // Create new content
    const { data, error } = await supabase
      .from('page_content')
      .insert({
        page_path: pagePath,
        content_data: contentData,
        created_by: userId,
        version: 1
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Get page content from Supabase
export const getPageContent = async (pagePath: string): Promise<Record<string, string> | null> => {
  const { data, error } = await supabase
    .from('page_content')
    .select('content_data')
    .eq('page_path', pagePath)
    .maybeSingle();
  
  if (error) throw error;
  return data?.content_data || null;
};

// Get all pages content for admin
export const getAllPagesContent = async (): Promise<PageContent[]> => {
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
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
    
    // Save the imported content
    await savePageContent(
      importData.pageUrl,
      importData.content,
      userId
    );
    
    return { 
      success: true, 
      message: `Content successfully imported for page: ${importData.pageUrl}` 
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
    
    return { valid: true, data: data as ContentExport };
  } catch (error: any) {
    return { 
      valid: false, 
      error: error.message || 'Invalid JSON format' 
    };
  }
};
