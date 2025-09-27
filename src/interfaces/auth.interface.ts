export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
  };
  tokens: {
    refresh: string;
    access: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

export interface AuthGuardProps {
  children: React.ReactNode;
}


