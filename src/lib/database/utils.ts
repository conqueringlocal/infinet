
import { supabase } from '../supabase';

/**
 * Execute SQL statements directly on the database
 * This function acts as a bridge to execute SQL when the rpc function doesn't exist
 */
export const executeSql = async (sqlQuery: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Using the REST API for raw SQL execution
    const response = await fetch(`${supabase.supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabase.supabaseKey,
        'Authorization': `Bearer ${supabase.supabaseKey}`,
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
