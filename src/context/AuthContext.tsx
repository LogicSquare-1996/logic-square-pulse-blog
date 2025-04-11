
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authApi from '@/api/auth';
import { toast } from 'sonner';

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
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
    const checkAuth = () => {
      const storedUser = authApi.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await authApi.login({ email, password });
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return false;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    confirmPassword: string
  ): Promise<boolean> => {
    try {
      const user = await authApi.register({ name, email, password, confirmPassword });
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed');
      return false;
    }
  };

  const oauthLogin = async (provider: 'google' | 'facebook', userData: any): Promise<boolean> => {
    try {
      const user = await authApi.oauthLogin({
        name: userData.name,
        email: userData.email,
        profilePicture: userData.picture,
        provider
      });
      
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('OAuth login error:', error);
      toast.error('Social login failed');
      return false;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData: any): Promise<boolean> => {
    try {
      const updatedUser = await authApi.updateProfile(profileData);
      if (updatedUser) {
        setUser({
          ...user,
          ...updatedUser
        } as User);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      return false;
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
