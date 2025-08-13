
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available (from cookies)
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_verified: boolean;
  created_at: string;
  last_login?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Authentication API functions
export const authAPI = {
  // Register user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login/', data);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post('/auth/logout/');
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/verify-email/', { token });
    return response.data;
  },

  // Verify email with token from URL
  verifyEmailToken: async (token: string): Promise<AuthResponse> => {
    const response = await api.get(`/auth/verify-email/${token}/`);
    return response.data;
  },

  // Resend verification email
  resendVerification: async (email: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/resend-verification/', { email });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/forgot-password/', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/reset-password/', { token, password });
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },
};

export default api;
