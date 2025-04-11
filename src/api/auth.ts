
import axiosInstance from './axios';
import { toast } from 'sonner';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface OAuthData {
  name: string;
  email: string;
  profilePicture?: string;
  provider: 'google' | 'facebook';
}

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  role: string;
  token: string;
}

export const login = async (data: LoginData): Promise<User | null> => {
  try {
    const response = await axiosInstance.post('/auth/login', data);
    if (response.data.success) {
      const user = response.data.user;
      
      // Store user data and token
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      
      toast.success('Logged in successfully');
      return user;
    }
    return null;
  } catch (error: any) {
    toast.error(error.response?.data?.error || 'Login failed');
    return null;
  }
};

export const register = async (data: RegisterData): Promise<User | null> => {
  try {
    // Validate password match
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return null;
    }
    
    // Validate email domain
    if (!data.email.endsWith('@logic-square.com')) {
      toast.error('Email must be from logic-square.com domain');
      return null;
    }
    
    const response = await axiosInstance.post('/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password
    });
    
    if (response.data.success) {
      const user = response.data.user;
      
      // Store user data and token
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      
      toast.success('Registered successfully');
      return user;
    }
    return null;
  } catch (error: any) {
    toast.error(error.response?.data?.error || 'Registration failed');
    return null;
  }
};

export const oauthLogin = async (data: OAuthData): Promise<User | null> => {
  try {
    // Validate email domain
    if (!data.email.endsWith('@logic-square.com')) {
      toast.error('Email must be from logic-square.com domain');
      return null;
    }
    
    const response = await axiosInstance.post('/auth/oauth', data);
    
    if (response.data.success) {
      const user = response.data.user;
      
      // Store user data and token
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      
      toast.success('Logged in successfully');
      return user;
    }
    return null;
  } catch (error: any) {
    toast.error(error.response?.data?.error || 'Login failed');
    return null;
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  toast.success('Logged out successfully');
};

export const getProfile = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/auth/profile');
    return response.data.user;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const updateProfile = async (data: any): Promise<any> => {
  try {
    const response = await axiosInstance.put('/users/profile', data);
    if (response.data.success) {
      // Update stored user data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully');
      return response.data.user;
    }
    return null;
  } catch (error: any) {
    toast.error(error.response?.data?.error || 'Failed to update profile');
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  const userJSON = localStorage.getItem('user');
  if (userJSON) {
    return JSON.parse(userJSON);
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isLoggedIn') === 'true';
};
