import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../services/api';
import { authAPI } from '../services/api';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message: string; emailVerificationRequired?: boolean }>;
  register: (first_name: string, last_name: string, email: string, password: string) => Promise<{ success: boolean; message: string; emailVerificationRequired?: boolean }>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<{ success: boolean; message: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Initialize auth state from cookies
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = Cookies.get('token');
        const storedUser = Cookies.get('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Verify token is still valid
          try {
            const response = await authAPI.getProfile();
            setUser(response.user);
          } catch {
            // Token is invalid, clear cookies
            Cookies.remove('token');
            Cookies.remove('user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await authAPI.login({ email, password });
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        // If rememberMe, set cookie for 30 days, else session cookie
        const cookieOptions = rememberMe
          ? { expires: 30, secure: true, sameSite: 'Strict' as const }
          : { secure: true, sameSite: 'Strict' as const };
        Cookies.set('token', response.token, cookieOptions);
        Cookies.set('user', JSON.stringify(response.user), cookieOptions);
        return { success: true, message: response.message };
      }
      return { success: false, message: 'Login failed' };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string; email_verification_required?: boolean } } };
      const errorMessage = axiosError?.response?.data?.error || 'Login failed';
      const emailVerificationRequired = axiosError?.response?.data?.email_verification_required;
      return { 
        success: false, 
        message: errorMessage,
        emailVerificationRequired 
      };
    }
  };

  const register = async (first_name: string, last_name: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ first_name, last_name, email, password });
      
      return { 
        success: true, 
        message: response.message,
        emailVerificationRequired: true
      };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      const errorMessage = axiosError?.response?.data?.error || 'Registration failed';
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove('token');
    Cookies.remove('user');
    // Call logout API
    authAPI.logout().catch(console.error);
  };

  const verifyEmail = async (token: string) => {
    try {
      const response = await authAPI.verifyEmail(token);
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        Cookies.set('token', response.token, { expires: 7, secure: true, sameSite: 'strict' });
        Cookies.set('user', JSON.stringify(response.user), { expires: 7, secure: true, sameSite: 'strict' });
      }
      return { success: true, message: response.message };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      const errorMessage = axiosError?.response?.data?.error || 'Email verification failed';
      return { success: false, message: errorMessage };
    }
  };

  const resendVerification = async (email: string) => {
    try {
      const response = await authAPI.resendVerification(email);
      return { success: true, message: response.message };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      const errorMessage = axiosError?.response?.data?.error || 'Failed to resend verification email';
      return { success: false, message: errorMessage };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return { success: true, message: response.message };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      const errorMessage = axiosError?.response?.data?.error || 'Failed to send password reset email';
      return { success: false, message: errorMessage };
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await authAPI.resetPassword(token, password);
      return { success: true, message: response.message };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      const errorMessage = axiosError?.response?.data?.error || 'Password reset failed';
      return { success: false, message: errorMessage };
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
