import { getCookie, setCookie, removeCookie } from './cookieHandler';
import api from './Api';
import { IUserProfile, IUpdateProfileData } from '@/types/auth';


const TOKEN_NAME = process.env.NEXT_PUBLIC_PRJ_NAME as string;

class AuthManager {
  private static instance: AuthManager;
  private user: IUserProfile | null = null;

  private constructor() {}

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  public async initialize(): Promise<void> {
    const token = this.getToken();
    if (token) {
      try {
        const user = await this.fetchUserProfile();
        this.setUser(user);
      } catch (error) {
        console.log("AUTH ERROR");
      }
    }
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public getUser(): IUserProfile | null {
    return this.user;
  }

  public async login(email: string, password: string): Promise<IUserProfile> {
    const response = await api.login(email, password);
    this.setToken(response.data.token);
    const user = await this.fetchUserProfile();
    this.setUser(user);
    return user;
  }

  public async signup(email: string, password: string, fullName: string): Promise<IUserProfile> {
    const response = await api.signup(email, password, fullName);
    this.setToken(response.data.token);
    const user = await this.fetchUserProfile();
    this.setUser(user);
    return user;
  }

  public async logout(): Promise<void> {
    try {
      await api.logout();
    } finally {
      this.clearAuth();
    }
  }

  public async updateProfile(profileData: IUpdateProfileData): Promise<IUserProfile> {
    const response = await api.updateProfile(profileData);
    const updatedUser = response.data.user;
    this.setUser(updatedUser);
    return updatedUser;
  }

  private async fetchUserProfile(): Promise<IUserProfile> {
    const response = await api.getProfile();
    return response.data.user;
  }

  private setUser(user: IUserProfile): void {
    this.user = user;
  }

  private getToken(): string | null {
    return getCookie(TOKEN_NAME);
  }

  private setToken(token: string): void {
    setCookie(TOKEN_NAME, token);
  }

  private clearAuth(): void {
    this.user = null;
    removeCookie(TOKEN_NAME);
  }
}

export const authManager = AuthManager.getInstance();

export async function initializeAuth(): Promise<void> {
  await authManager.initialize();
}

export function useAuth() {
  return {
    isAuthenticated: authManager.isAuthenticated.bind(authManager),
    getUser: authManager.getUser.bind(authManager),
    login: authManager.login.bind(authManager),
    signup: authManager.signup.bind(authManager),
    logout: authManager.logout.bind(authManager),
    updateProfile: authManager.updateProfile.bind(authManager),
  };
}