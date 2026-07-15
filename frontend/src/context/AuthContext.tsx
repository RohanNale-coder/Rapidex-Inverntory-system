import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios base URL - proxy will handle routing to backend
axios.defaults.baseURL = '/api';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 1,
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Authentication bypassed - user is automatically authenticated
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Login bypassed - no actual authentication needed
    console.log('Login bypassed:', email);
  };

  const logout = () => {
    // Logout disabled - authentication always enabled
    console.log('Logout bypassed');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: true, user, login, logout, loading }}>
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