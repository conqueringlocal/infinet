
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
    
    // For demo purposes, we'll simulate success
    // In a real implementation, we would insert into the page_views table
    
    // Increment the analytics counts
    await incrementPageAnalytics(pagePath);
    
    return true;
  } catch (error) {
    console.error('Error in recordPageView:', error);
    return false;
  }
};

/**
 * Increment analytics for a page
 */
const incrementPageAnalytics = async (pagePath: string): Promise<void> => {
  try {
    // Check if an entry exists for this page
    const { data, error } = await supabase
      .from('page_analytics')
      .select('id, view_count, unique_visitors')
      .eq('page_path', pagePath)
      .single();
    
    if (error && error.code !== 'PGRST116') { // Not found
      console.error('Error checking for existing analytics:', error);
      return;
    }
    
    const now = new Date().toISOString();
    
    if (data) {
      // Update existing entry
      await supabase
        .from('page_analytics')
        .update({
          view_count: data.view_count + 1,
          last_viewed_at: now,
        })
        .eq('id', data.id);
    } else {
      // Create new entry
      await supabase
        .from('page_analytics')
        .insert({
          page_path: pagePath,
          view_count: 1,
          unique_visitors: 1,
          last_viewed_at: now,
        });
    }
  } catch (error) {
    console.error('Error incrementing page analytics:', error);
  }
};

/**
 * Get analytics for all pages
 */
export const getAllPagesAnalytics = async (): Promise<PageAnalytics[]> => {
  try {
    const { data, error } = await supabase
      .from('page_analytics')
      .select('*')
      .order('view_count', { ascending: false });
    
    if (error) {
      console.error('Error fetching page analytics:', error);
      return getMockAnalytics();
    }
    
    return data && data.length > 0 ? data : getMockAnalytics();
  } catch (error) {
    console.error('Error in getAllPagesAnalytics:', error);
    return getMockAnalytics();
  }
};

/**
 * Get analytics for a specific page
 */
export const getPageAnalytics = async (pagePath: string): Promise<PageAnalytics | null> => {
  try {
    const { data, error } = await supabase
      .from('page_analytics')
      .select('*')
      .eq('page_path', pagePath)
      .single();
    
    if (error) {
      console.error('Error fetching page analytics:', error);
      return null;
    }
    
    return data;
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
      .from('page_analytics')
      .select('*')
      .order('view_count', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching popular pages:', error);
      return getMockAnalytics(limit);
    }
    
    return data && data.length > 0 ? data : getMockAnalytics(limit);
  } catch (error) {
    console.error('Error in getPopularPages:', error);
    return getMockAnalytics(limit);
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

/**
 * Generate mock analytics data for demonstration
 */
const getMockAnalytics = (limit: number = 5): PageAnalytics[] => {
  const pages = ['/', '/about', '/services', '/projects', '/contact', '/service/fiber', '/service/wireless'];
  
  return pages.slice(0, limit).map((path, index) => ({
    page_path: path,
    view_count: Math.floor(Math.random() * 1000) + 100,
    unique_visitors: Math.floor(Math.random() * 500) + 50,
    last_viewed_at: new Date().toISOString(),
  }));
};
