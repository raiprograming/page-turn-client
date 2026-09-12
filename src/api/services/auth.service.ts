import apiClient from '../client';
import { AUTH_ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../types';

export interface GoogleRedirectUrlResponse {
  redirectUrl: string;
}

export interface UserInfoResponse {
  userId: string;
  email: string;
  photoUrl: string;
  name: string;
  token: string;
  picture: string;
  role: string;
}

// Example service method: fetches the Google OAuth redirect URL from the
// server. Every domain (auth, users, books, etc.) should get its own
// service file like this one under `src/api/services/`.
export const getGoogleRedirectUrl = async (redirectUrl: string): Promise<ApiResponse<GoogleRedirectUrlResponse>> => {
  const { data } = await apiClient.post<ApiResponse<GoogleRedirectUrlResponse>>(
    AUTH_ENDPOINTS.googleRedirectUrl,
    { redirectUrl: redirectUrl },
  );

  return data;
};

export const getUserInfoFromCode = async (code: string, redirectUrl: string): Promise<ApiResponse<UserInfoResponse>> => {
  const { data } = await apiClient.post<ApiResponse<UserInfoResponse>>(
    AUTH_ENDPOINTS.googleCallback,
    { code: code, redirectUrl: redirectUrl },
  );

  return data;
};

// Matches the user document returned by the server's /email/login route
// (password field stripped before it is sent back).
export interface EmailLoginResponse {
  _id?: string;
  email: string;
  role: string;
  picture?: string;
  name?: string;
  gender?: string;
  mobile?: number | null;
}

export const emailLogin = async (email: string, password: string): Promise<ApiResponse<EmailLoginResponse>> => {
  const { data } = await apiClient.post<ApiResponse<EmailLoginResponse>>(
    AUTH_ENDPOINTS.emailLogin,
    { email: email, password: password },
  );

  return data;
};
