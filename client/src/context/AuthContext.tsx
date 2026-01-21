import React, { useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';
import api from '../services/api';
import { AuthContext } from './AuthContextDef';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const userData = await api.getCandidateProfile();
          setUser(userData);
        } catch {
          api.clearToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await api.login(credentials);
    setUser(response.user);
  };

  const register = async (data: RegisterData) => {
    const response = await api.register(data);
    setUser(response.user);
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
