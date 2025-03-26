
// User role and permission types
export type UserRole = 'admin' | 'editor' | 'contributor' | 'viewer';

export type Permission = 'manage_users' | 'edit_content' | 'publish_content' | 'view_content' | 'manage_media';

export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  full_name?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
  avatar_url?: string;
  bio?: string;
  settings?: Record<string, any>;
}
