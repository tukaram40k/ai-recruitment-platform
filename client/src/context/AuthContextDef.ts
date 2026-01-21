import { createContext } from 'react';
import { User, LoginCredentials, RegisterData, LoginResponse, TwoFactorVerifyRequest, TOTPSetupResponse, TOTPVerifyRequest, Toggle2FAResponse } from '../types';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  verify2FA: (data: TwoFactorVerifyRequest) => Promise<void>;
  setupTOTP: () => Promise<TOTPSetupResponse>;
  confirmTOTP: (data: TOTPVerifyRequest) => Promise<Toggle2FAResponse>;
  disableTOTP: (data: TOTPVerifyRequest) => Promise<Toggle2FAResponse>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
