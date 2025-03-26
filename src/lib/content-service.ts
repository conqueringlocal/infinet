
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
