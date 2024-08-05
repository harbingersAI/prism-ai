// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/Api';
import { getCookie, removeCookie } from '../utils/cookieHandler';
import { IUserProfile } from '../types/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<IUserProfile | null>(null);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    const token = getCookie(process.env.NEXT_PUBLIC_PRJ_NAME as string);
    
    if (token) {
      try {
        const response = await api.getProfile();
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        removeCookie(process.env.NEXT_PUBLIC_PRJ_NAME as string);
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      console.log('No auth token found');
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);  // Make sure this is called in all cases
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      setUser(response.data.user);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const updateUser = (updatedUserData: Partial<IUserProfile>) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...updatedUserData } : null);
  };

  const logout = async () => {
    try {
      await api.logout();
      removeCookie(process.env.NEXT_PUBLIC_PRJ_NAME as string);
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const getAuthToken = useCallback(() => {
    return getCookie(process.env.NEXT_PUBLIC_PRJ_NAME as string) || null;
  }, []);

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuth,
    updateUser,
    getAuthToken,
  };
}