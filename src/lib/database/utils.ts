
import { supabase } from '../supabase';

/**
 * Execute SQL statements directly on the database
 * This function acts as a bridge to execute SQL when the rpc function doesn't exist
 */
export const executeSql = async (sqlQuery: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Get the Supabase URL and key from our configuration
    const supabaseUrl = "https://gqcfneuiruffgpwhkecy.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxY2ZuZXVpcnVmZmdwd2hrZWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NjUyNzAsImV4cCI6MjA1ODU0MTI3MH0.Wm8coMFjXv8TA2bQfiXoDYjzml92iTPSDuZOlPJhD_0";

    // Using the REST API for raw SQL execution
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: sqlQuery
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { 
        success: false, 
        message: `Error executing SQL: ${errorText}` 
      };
    }

    return { success: true, message: 'SQL executed successfully' };
  } catch (error) {
    console.error('Error executing SQL:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error executing SQL' 
    };
  }
};
