
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
    
    // Initialize tables
    const userProfilesResult = await initializeUserProfilesTable();
    if (!userProfilesResult.success) {
      return userProfilesResult;
    }
    
    const pageAssignmentsResult = await initializePageAssignmentsTable();
    if (!pageAssignmentsResult.success) {
      return pageAssignmentsResult;
    }
    
    const pageContentResult = await initializePageContentTable();
    if (!pageContentResult.success) {
      return pageContentResult;
    }
    
    const pageAnalyticsResult = await initializePageAnalyticsTable();
    if (!pageAnalyticsResult.success) {
      return pageAnalyticsResult;
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
    const dbResult = await initializeDatabase();
    if (!dbResult.success) {
      return dbResult;
    }
    
    // Create the default admin user
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
