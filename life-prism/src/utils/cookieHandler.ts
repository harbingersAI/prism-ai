// utils/cookieHandler.ts

import { setCookie as setNookies, destroyCookie, parseCookies } from 'nookies';
import { GetServerSidePropsContext } from 'next';
import { NextApiRequest, NextApiResponse } from 'next';

// Type for context, allowing both client-side and server-side usage
type ContextType = GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse } | null | undefined;

// Cookie options for setting cookies
const COOKIE_OPTIONS = {
  maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  path: '/', // The path where the cookie is accessible
  secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  sameSite: 'lax' as const, // SameSite attribute for cross-site request handling
  httpOnly: false, // Change to true if you want server-only access
  domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined, // Domain for the cookie
};

/**
 * Sets a cookie with a specified key and value.
 * @param key - The name of the cookie
 * @param value - The value to store in the cookie
 * @param ctx - Optional context (for server-side operations)
 */
export const setCookie = (key: string, value: string, ctx?: ContextType): void => {
  // Use nookies to set the cookie
  setNookies(ctx, key, value, COOKIE_OPTIONS);
  console.log(`Cookie set: ${key}=${value}`); // Debug log for cookie setting
};

/**
 * Gets a cookie value by key.
 * @param key - The name of the cookie
 * @param ctx - Optional context (for server-side operations)
 * @returns The value of the cookie, or null if not found
 */
export const getCookie = (key: string, ctx?: ContextType): string | null => {
  // Log the key being accessed


  // Parse cookies from the context or from the client-side if ctx is undefined
  const cookies = parseCookies(ctx); // Correct usage of parseCookies


  // Retrieve and return the cookie value by key, or null if not found
  const value = cookies[key] || null;


  return value;
};

/**
 * Removes a cookie by key.
 * @param key - The name of the cookie to remove
 * @param ctx - Optional context (for server-side operations)
 */
export const removeCookie = (key: string, ctx?: ContextType): void => {
  // Destroy the cookie with the given key
  destroyCookie(ctx, key, {
    path: '/',
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined, // Ensure the domain is consistent
  });
  console.log(`Cookie removed: ${key}`); // Debug log for cookie removal
};

/**
 * Sets the authentication token in a cookie.
 * @param token - The JWT token
 * @param ctx - Optional context (for server-side operations)
 */
export const setAuthToken = (token: string, ctx?: ContextType): void => {
  // Set the auth token using the project name as the key
  const key = process.env.NEXT_PUBLIC_PRJ_NAME as string;
  setCookie(key, token, ctx);
  console.log(`Auth token set for key: ${key}`); // Debug log for auth token setting
};

/**
 * Gets the authentication token from the cookie.
 * @param ctx - Optional context (for server-side operations)
 * @returns The JWT token, or null if not found
 */
export const getAuthToken = (ctx?: ContextType): string | null => {
  // Get the auth token using the project name as the key
  const key = process.env.NEXT_PUBLIC_PRJ_NAME as string;
  const token = getCookie(key, ctx);
  console.log(`Auth token retrieved for key: ${key}`); // Debug log for auth token retrieval
  return token;
};

/**
 * Removes the authentication token cookie.
 * @param ctx - Optional context (for server-side operations)
 */
export const removeAuthToken = (ctx?: ContextType): void => {
  // Remove the auth token using the project name as the key
  const key = process.env.NEXT_PUBLIC_PRJ_NAME as string;
  removeCookie(key, ctx);
  console.log(`Auth token removed for key: ${key}`); // Debug log for auth token removal
};

/**
 * Checks if the user is authenticated based on the presence of the auth token.
 * @param ctx - Optional context (for server-side operations)
 * @returns True if the auth token exists, false otherwise
 */
export const isAuthenticated = (ctx?: ContextType): boolean => {
  // Check if the auth token is present
  const token = getAuthToken(ctx);
  const isAuthenticated = !!token;
  console.log(`User is authenticated: ${isAuthenticated}`); // Debug log for authentication check
  return isAuthenticated;
};
