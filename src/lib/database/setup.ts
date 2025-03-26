
import { initializeUserProfilesTable } from './tables/user-profiles';
import { initializePageAssignmentsTable } from './tables/page-assignments';
import { initializePageContentTable } from './tables/page-content';
import { initializePageAnalyticsTable } from './tables/page-analytics';
import { createDefaultAdminUser } from './admin';

/**
 * Creates all the necessary database tables if they don't exist
 */
export const initializeDatabase = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Initializing database...');
    
    // Step 1: Initialize user_profiles (no dependencies)
    console.log('Step 1: Creating user_profiles table...');
    const userProfilesResult = await initializeUserProfilesTable();
    if (!userProfilesResult.success) {
      console.error('Failed to create user_profiles table:', userProfilesResult.message);
      return userProfilesResult;
    }
    console.log('User profiles table created successfully');
    
    // Step 2: Initialize page_assignments (depends on user_profiles)
    console.log('Step 2: Creating page_assignments table...');
    const pageAssignmentsResult = await initializePageAssignmentsTable();
    if (!pageAssignmentsResult.success) {
      console.error('Failed to create page_assignments table:', pageAssignmentsResult.message);
      return pageAssignmentsResult;
    }
    console.log('Page assignments table created successfully');
    
    // Step 3: Create page_content (depends on user_profiles for references)
    console.log('Step 3: Creating page_content table...');
    const pageContentResult = await initializePageContentTable();
    if (!pageContentResult.success) {
      console.error('Failed to create page_content table:', pageContentResult.message);
      return pageContentResult;
    }
    console.log('Page content table created successfully');
    
    // Step 4: Create page_analytics (depends on page_content)
    console.log('Step 4: Creating page_analytics table...');
    const pageAnalyticsResult = await initializePageAnalyticsTable();
    if (!pageAnalyticsResult.success) {
      console.error('Failed to create page_analytics table:', pageAnalyticsResult.message);
      // We'll continue even if analytics table fails, as it's not critical
      console.warn('Page analytics table creation failed, but continuing with setup');
    } else {
      console.log('Page analytics table created successfully');
    }
    
    console.log('Database initialized successfully!');
    return { success: true, message: 'Database initialized successfully' };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown database initialization error' 
    };
  }
};

/**
 * Performs a complete CMS setup
 */
export const setupCMS = async (
  email: string = 'admin@example.com',
  password: string = 'admin123'
): Promise<{ success: boolean; message: string }> => {
  try {
    // Initialize the database
    console.log('Setting up database...');
    const dbResult = await initializeDatabase();
    if (!dbResult.success) {
      return dbResult;
    }
    
    // Create the default admin user
    console.log('Creating admin user...');
    const adminResult = await createDefaultAdminUser(email, password);
    if (!adminResult.success) {
      return adminResult;
    }
    
    return {
      success: true,
      message: `CMS setup complete! ${adminResult.message}`
    };
  } catch (error) {
    console.error('Error setting up CMS:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error during CMS setup'
    };
  }
};
