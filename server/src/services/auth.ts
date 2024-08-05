import { supabaseClient, supabaseAdmin } from '../config/supabase';
import { generateToken } from './jwt';
import {
  ISignUpRequest,
  ILoginRequest,
  IUpdateProfileRequest,
  IAuthResponse,
  IProfileUpdateResponse,
  IUserProfile,
  IAuthError,
} from '../types/auth';
import { AuthError } from '@supabase/supabase-js';

class AuthService {
  async signUp({ email, password, full_name }: ISignUpRequest): Promise<IAuthResponse> {
    try {
      const { data: authData, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { full_name },
        },
      });

      if (error) { console.log(error); throw error; }
      
      if (!authData.user || !authData.session) {

        throw new Error('User registration failed');
      }

      const token = generateToken(authData.user.id, email);

      const userProfile = await this.getUserProfile(authData.user.id);

      return {
        user: userProfile,
        session: {
          access_token: token,
          refresh_token: authData.session.refresh_token,
          expires_in: 3600, // 1 hour, adjust as needed
          token_type: 'bearer',
        },
      };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async login({ email, password }: ILoginRequest): Promise<IAuthResponse> {
    try {
      const { data: authData, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!authData.user || !authData.session) {   console.log('this again');
        throw new Error('Login failed');
     
      }

      const token = generateToken(authData.user.id, email);

      const userProfile = await this.getUserProfile(authData.user.id);

      // Update last_login
      await supabaseAdmin
        .from('users_table')
        .update({ last_login: new Date().toISOString() })
        .eq('user_id', authData.user.id);

      return {
        user: userProfile,
        session: {
          access_token: token,
          refresh_token: authData.session.refresh_token,
          expires_in: 3600, // 1 hour, adjust as needed
          token_type: 'bearer',
        },
      };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async updateProfile(userId: string, profileData: IUpdateProfileRequest): Promise<IProfileUpdateResponse> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users_table')
        .update(profileData)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
        console.log(data);
      if (error) {
        throw new Error('Profile update failed');
      }

      return ( data );
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

    async getUserProfile(userId: string): Promise<IUserProfile> {
    const { data, error } = await supabaseAdmin
      .from('users_table')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    if (!data) {
      throw new Error('User profile not found');
    }

    return data as IUserProfile;
  }

  private handleAuthError(error: unknown): IAuthError {
    if (error instanceof AuthError) {
      return {
        message: error.message,
        code: error.status?.toString() || 'unknown',
      };
    }
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'unknown',
      };
    }
    return {
      message: 'An unknown error occurred',
      code: 'unknown',
    };
  }
}

export const authService = new AuthService();