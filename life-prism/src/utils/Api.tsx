import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getCookie, setCookie, removeCookie } from './cookieHandler';
import { IUpdateProfileData } from '@/types/auth';
// Types
interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

interface ErrorResponse {
  message: string;
  code?: string;
}

interface SessionInfo {
    session_uuid: string;
    session_start: string;
    session_end: string;
    // Add other session info fields as needed
  }

type ApiMethod = 'get' | 'post' | 'put' | 'delete';

// API class
class Api {
  private instance: AxiosInstance;
  private static API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  private static TOKEN_NAME = process.env.NEXT_PUBLIC_PRJ_NAME as string; // Using API_KEY as token name

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': Api.API_KEY,
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
        (config) => {
          const token = getCookie(Api.TOKEN_NAME);
          if (token) {
            console.log('Adding token to request:', token);
            config.headers['Authorization'] = `Bearer ${token}`;
          } else {
            console.log('No token found for request');
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
            console.log("401 error, not sure why.");

          // Redirect to login page or trigger a global event for unauthorized access
        }
        return Promise.reject(error);
      }
    );
  }

  private async request<T>(method: ApiMethod, url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.instance({
        method,
        url,
        data,
        ...config,
      });

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorResponse: ErrorResponse = {
          message: error.response?.data?.message || 'An unexpected error occurred',
          code: error.response?.data?.code,
        };
        throw errorResponse;
      }
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse> {
    const response = await this.request<{ user: any; session: { access_token: string } }>('post', '/api/auth/login', { email, password });
    console.log('Login response:', response);
    if (response.data.session && response.data.session.access_token) {
      console.log('Setting auth token:', response.data.session.access_token);
      setCookie(Api.TOKEN_NAME, response.data.session.access_token);
    } else {
      console.warn('No token received from login response');
    }
    return response;
  }
  

  async signup(email: string, password: string, fullName: string): Promise<ApiResponse> {
    const response = await this.request<{ user: any; session: { access_token: string } }>('post', '/api/auth/signup', { email, password, full_name: fullName });
    console.log('Signup response:', response);
    if (response.data.session && response.data.session.access_token) {
      console.log('Setting auth token:', response.data.session.access_token);
      setCookie(Api.TOKEN_NAME, response.data.session.access_token);
    } else {
      console.warn('No token received from signup response');
    }
    return response;
  }

  async logout(): Promise<void> {
    console.log('Logging out');
    removeCookie(Api.TOKEN_NAME);
    // You might want to invalidate the token on the server side in the future
  }

  // Profile methods
  async getProfile(): Promise<ApiResponse> {
    return this.request('get', '/api/auth/profile');
  }

  async updateProfile(profileData: IUpdateProfileData): Promise<ApiResponse> {
    return this.request('put', '/api/auth/profile', profileData);
  }

  async getChatSessionInfo(chatUuid: string): Promise<ApiResponse<SessionInfo>> {
    return this.get<SessionInfo>(`/api/chat/chat-session-info/${chatUuid}`);
  }

  // Generic methods for other API calls
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('get', url, undefined, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('post', url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('put', url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('delete', url, undefined, config);
  }

  async startSummaryProcess(chatUuid: string): Promise<ApiResponse> {
    return this.request('post', '/api/chat/start-summary', { chatUuid });
  }

  async getLatestPsychometricProfile(): Promise<ApiResponse> {
    return this.request('get', '/api/chat/latest-psych-profile');
  }

  async getLatestSessionInfo(chatUuid: string): Promise<ApiResponse> {
    return this.request('get', `/api/chat/latest-session-info/${chatUuid}`);
  }
  
  async getSessionStatus(chatUuid: string): Promise<ApiResponse> {
    return this.request('get', `/api/chat/session-status/${chatUuid}`);
  }
  
}

const api = new Api();
export default api;