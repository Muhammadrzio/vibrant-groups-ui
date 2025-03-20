
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/lib/api';
import { User, AuthResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (name: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  checkAuth: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Clear any existing token first
      localStorage.removeItem('token');
      setToken(null);
      
      const response = await api.post<AuthResponse>('/auth', { username, password });
      const { user, token } = response.data;
      
      // Save the token to localStorage
      localStorage.setItem('token', token);
      
      // Update state
      setUser(user);
      setToken(token);
      
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid username or password');
      throw error;
    }
  };

  const register = async (name: string, username: string, password: string) => {
    try {
      const response = await api.post<User>('/users', { name, username, password });
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Username may already be taken.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const checkAuth = async (): Promise<boolean> => {
    if (!token) {
      setLoading(false);
      return false;
    }

    try {
      const response = await api.get<User>('/auth');
      setUser(response.data);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    if (token) {
      checkAuth();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
