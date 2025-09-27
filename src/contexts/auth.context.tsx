import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  api,
  clearAuthTokens,
  getAccessToken,
  getStoredUser,
} from "../services/api";
import {
  LoginRequest,
  LoginResponse,
  AuthContextType,
  User,
} from "@/interfaces/auth.interface";
import { Navigate } from "react-router-dom";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    const token = getAccessToken();
    const storedUser = getStoredUser();

    if (token && storedUser) {
      setUser(storedUser as unknown as User);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await api.post<LoginResponse>(
        "/auth/login/",
        credentials
      );

      const { tokens, user: userData } = response.data;
      localStorage.setItem("access_token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);

      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    clearAuthTokens();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
