// Ensure this interface matches exactly with your server-side IUserProfile
// types/auth.ts
export interface IUserProfile {
  id: string;
  email: string;
  full_name: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  is_active: boolean;
  subscription_status: 'free' | 'premium' | 'enterprise';
  subscription_expiry: string | null;
  timezone: string | null;
  language_preference: string | null;
  marketing_opt_in: boolean;
  username: string | null;
}
// This interface should match the updateProfile method in your API class
export interface IUpdateProfileData {
  full_name?: string;
  timezone?: string;
  language_preference?: string;
  marketing_opt_in?: boolean;
}

export interface IUpdateProfileRequest {
  full_name?: string;
  timezone?: string;
  language_preference?: string;
  marketing_opt_in?: boolean;
}