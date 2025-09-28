import { api, clearAuthTokens } from "./api";
import { LoginRequest, LoginResponse } from "@/interfaces/auth.interface";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login/", credentials);

  const { tokens } = response.data;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);

  return response.data;
};

export const logout = (): void => {
  clearAuthTokens();
  window.location.replace("/");
};
