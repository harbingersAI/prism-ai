import { User } from '@supabase/supabase-js';

// User-related interfaces
export interface IUserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  username: string;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  is_active: boolean;
  subscription_status: 'free' | 'premium' | 'enterprise';
  subscription_expiry: string | null;
  timezone: string | null;
  language_preference: string | null;
  marketing_opt_in: boolean;
}

export interface IUserMetadata {
  full_name?: string;
}

// Request payload interfaces
export interface ISignUpRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IUpdateProfileRequest {
  full_name?: string;
  timezone?: string;
  language_preference?: string;
  marketing_opt_in?: boolean;
}

// Response interfaces
export interface IAuthResponse {
  user: IUserProfile;
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  };
}

export interface IProfileUpdateResponse {
  user: IUserProfile;
}

// JWT related interfaces
export interface IJwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

// Error interfaces
export interface IAuthError {
  message: string;
  code: string;
}

// Supabase specific types
export type SupabaseUser = User;

// Utility types
export type Nullable<T> = T | null;

// Enum for subscription status
export enum SubscriptionStatus {
  Free = 'free',
  Premium = 'premium',
  Enterprise = 'enterprise',
}

// Type for language preferences
export type LanguagePreference = 'en' | 'es' | 'fr' | 'de' | 'zh';

// Interface for user settings
export interface IUserSettings {
  notifications_enabled: boolean;
  theme: 'light' | 'dark' | 'system';
  two_factor_auth: boolean;
}

// Interface for authentication options
export interface IAuthOptions {
  rememberMe?: boolean;
  redirectUrl?: string;
}

// Type for authentication providers
export type AuthProvider = 'email' | 'google' | 'facebook' | 'twitter';

// Interface for OAuth sign-in options
export interface IOAuthSignInOptions {
  provider: AuthProvider;
  scopes?: string[];
}

// Interface for password reset request
export interface IPasswordResetRequest {
  email: string;
}

// Interface for password reset confirmation
export interface IPasswordResetConfirmation {
  token: string;
  newPassword: string;
}

// Interface for refresh token request
export interface IRefreshTokenRequest {
  refresh_token: string;
}

// Interface for two-factor authentication setup
export interface ITwoFactorSetup {
  secret: string;
  qrCode: string;
}

// Interface for two-factor authentication verification
export interface ITwoFactorVerification {
  token: string;
}