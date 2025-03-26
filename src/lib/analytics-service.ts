
import { supabase } from './supabase';

export type PageView = {
  id?: string;
  page_path: string;
  viewed_at: string;
  user_id?: string;
  session_id: string;
  referrer?: string;
  user_agent?: string;
  device_type?: 'mobile' | 'tablet' | 'desktop';
};

export type PageAnalytics = {
  page_path: string;
  view_count: number;
  unique_visitors: number;
  last_viewed_at: string;
};

/**
 * Records a page view in the analytics table
 */
export const recordPageView = async (pagePath: string, userId?: string): Promise<boolean> => {
  try {
    // Generate a session ID if none exists
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('session_id', sessionId);
    }
    
    // Get device type
    const deviceType = getDeviceType();
    
    const pageView: PageView = {
      page_path: pagePath,
      viewed_at: new Date().toISOString(),
      user_id: userId,
      session_id: sessionId,
      referrer: document.referrer || undefined,
      user_agent: navigator.userAgent,
      device_type: deviceType,
    };
    
    const { error } = await supabase
      .from('page_analytics')
      .insert(pageView);
      
    if (error) {
      console.error('Error recording page view:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in recordPageView:', error);
    return false;
  }
};

/**
 * Get analytics for all pages
 */
export const getAllPagesAnalytics = async (): Promise<PageAnalytics[]> => {
  try {
    // Using SQL for complex analytics query
    const { data, error } = await supabase
      .rpc('get_all_pages_analytics');
    
    if (error) {
      console.error('Error fetching page analytics:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllPagesAnalytics:', error);
    return [];
  }
};

/**
 * Get analytics for a specific page
 */
export const getPageAnalytics = async (pagePath: string): Promise<PageAnalytics | null> => {
  try {
    const { data, error } = await supabase
      .rpc('get_page_analytics', { page_path: pagePath });
    
    if (error) {
      console.error('Error fetching page analytics:', error);
      return null;
    }
    
    return data ? data[0] : null;
  } catch (error) {
    console.error('Error in getPageAnalytics:', error);
    return null;
  }
};

/**
 * Get the most popular pages
 */
export const getPopularPages = async (limit: number = 5): Promise<PageAnalytics[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_popular_pages', { page_limit: limit });
    
    if (error) {
      console.error('Error fetching popular pages:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getPopularPages:', error);
    return [];
  }
};

/**
 * Helper function to determine device type
 */
const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return 'tablet';
  }
  
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return 'mobile';
  }
  
  return 'desktop';
};
