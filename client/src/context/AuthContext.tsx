import React, { useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, LoginResponse, TwoFactorVerifyRequest, TOTPSetupResponse, TOTPVerifyRequest, Toggle2FAResponse } from '../types';
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

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.login(credentials);
    // Only set user if 2FA is not required
    if (!response.requires_2fa && response.user) {
      setUser(response.user);
    }
    return response;
  };

  const verify2FA = async (data: TwoFactorVerifyRequest): Promise<void> => {
    const response = await api.verify2FA(data);
    setUser(response.user);
  };

  const setupTOTP = async (): Promise<TOTPSetupResponse> => {
    return api.setupTOTP();
  };

  const confirmTOTP = async (data: TOTPVerifyRequest): Promise<Toggle2FAResponse> => {
    const response = await api.confirmTOTP(data);
    if (user) {
      setUser({ ...user, two_factor_enabled: true, totp_confirmed: true });
    }
    return response;
  };

  const disableTOTP = async (data: TOTPVerifyRequest): Promise<Toggle2FAResponse> => {
    const response = await api.disableTOTP(data);
    if (user) {
      setUser({ ...user, two_factor_enabled: false, totp_confirmed: false });
    }
    return response;
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
        verify2FA,
        setupTOTP,
        confirmTOTP,
        disableTOTP,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
