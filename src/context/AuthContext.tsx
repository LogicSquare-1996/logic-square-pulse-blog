
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/api/api';
import { toast } from 'sonner';

interface User {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, phone: string, firstName: string, lastName: string, password: string, confirmPassword: string) => Promise<boolean>;
  oauthLogin: (provider: 'google' | 'facebook', userData: any) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Verify token validity by fetching current user
          const response = await api.user.getCurrentUser();
          if (response.data && response.data.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            // Token invalid, clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Auth check error:', error);
          // Clear storage on error
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else if (storedUser) {
        // Handle the demo mode with no actual API
        const userObj = JSON.parse(storedUser);
        setUser(userObj);
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (handle: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // For demo purposes, allow login with any @logic-square.com email
      if (handle.endsWith('@logic-square.com') && password.length > 3) {
        const mockUser = {
          _id: 'user-123',
          email: handle,
          name: handle.split('@')[0],
          profilePicture: 'https://via.placeholder.com/150',
          role: handle.includes('admin') ? 'admin' : 'user'
        };
        
        localStorage.setItem('token', 'demo-token-123');
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('isLoggedIn', 'true');
        
        setUser(mockUser);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return true;
      }
      
      // Try API login
      try {
        const response = await api.auth.login({ handle, password });
        
        if (response.data && response.data.success) {
          const { user, token } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isLoggedIn', 'true');
          
          setUser(user);
          setIsAuthenticated(true);
          toast.success('Login successful!');
          return true;
        }
      } catch (error) {
        console.error('API login error:', error);
        // Fall back to demo login if API fails
        if (handle.endsWith('@logic-square.com') && password.length > 3) {
          return login(handle, password);
        }
        toast.error('Login failed');
        return false;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string, 
    email: string, 
    phone: string,
    firstName: string,
    lastName: string,
    password: string, 
    confirmPassword: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Demo registration
      if (email.endsWith('@logic-square.com') && password === confirmPassword) {
        const mockUser = {
          _id: `user-${Date.now()}`,
          email,
          name: firstName + ' ' + lastName,
          firstName,
          lastName,
          profilePicture: 'https://via.placeholder.com/150',
          role: 'user'
        };
        
        localStorage.setItem('token', `demo-token-${Date.now()}`);
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('isLoggedIn', 'true');
        
        setUser(mockUser);
        setIsAuthenticated(true);
        toast.success('Registration successful!');
        return true;
      }
      
      // Try API registration
      try {
        const response = await api.auth.register({
          username,
          email,
          phone,
          name: { first: firstName, last: lastName },
          password,
          rePassword: confirmPassword
        });
        
        if (response.data && response.data.success) {
          toast.success('Registration successful! Please verify your email.');
          return true;
        }
      } catch (error) {
        console.error('API registration error:', error);
        // Fall back to demo registration if API fails
        if (email.endsWith('@logic-square.com') && password === confirmPassword) {
          return register(username, email, phone, firstName, lastName, password, confirmPassword);
        }
        toast.error('Registration failed');
        return false;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const oauthLogin = async (provider: 'google' | 'facebook', userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Demo OAuth login
      if (userData.email && userData.email.endsWith('@logic-square.com')) {
        const mockUser = {
          _id: `user-${Date.now()}`,
          email: userData.email,
          name: userData.name,
          profilePicture: userData.picture || 'https://via.placeholder.com/150',
          role: 'user'
        };
        
        localStorage.setItem('token', `demo-${provider}-token-${Date.now()}`);
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('isLoggedIn', 'true');
        
        setUser(mockUser);
        setIsAuthenticated(true);
        toast.success(`${provider} login successful!`);
        return true;
      }
      
      // Try API OAuth login
      try {
        const response = await api.auth.googleLogin(userData.idToken);
        
        if (response.data && response.data.success) {
          const { user, token } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isLoggedIn', 'true');
          
          setUser(user);
          setIsAuthenticated(true);
          toast.success(`${provider} login successful!`);
          return true;
        }
      } catch (error) {
        console.error('API OAuth login error:', error);
        // Fall back to demo OAuth if API fails
        if (userData.email && userData.email.endsWith('@logic-square.com')) {
          return oauthLogin(provider, userData);
        }
        toast.error('Social login failed');
        return false;
      }
      
      return false;
    } catch (error) {
      console.error('OAuth login error:', error);
      toast.error('Social login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Demo profile update
      if (user) {
        const updatedUser = {
          ...user,
          ...profileData
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.success('Profile updated successfully');
        return true;
      }
      
      // Try API profile update
      try {
        const response = await api.user.updateProfile(profileData);
        
        if (response.data && response.data.success) {
          const updatedUser = response.data.user;
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          setUser({
            ...user,
            ...updatedUser
          } as User);
          
          toast.success('Profile updated successfully');
          return true;
        }
      } catch (error) {
        console.error('API profile update error:', error);
        // Fall back to demo update if API fails
        if (user) {
          return updateProfile(profileData);
        }
        toast.error('Failed to update profile');
        return false;
      }
      
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        oauthLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
