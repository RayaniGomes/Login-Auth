import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth.context";
import { AuthGuardProps } from "@/interfaces/auth.interface";
import IsLoading from "@/utils/isLoading.function";

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return IsLoading();
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return IsLoading();
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
