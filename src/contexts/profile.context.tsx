import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { api } from "../services/api";
import { ProfileContextType, UserProfile } from "@/interfaces/profile.interface";
import { AxiosError } from "axios";
import { ApiError } from "@/interfaces/error.interface";

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfile = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get<UserProfile>("/auth/profile/");

      setProfile(response.data);
    } catch (err: unknown) {
      const errorMessage =
        (err as AxiosError<ApiError>).response?.data?.message ||
        "Erro ao carregar perfil";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearProfile = (): void => {
    setProfile(null);
    setError(null);
  };

  const value: ProfileContextType = {
    profile,
    isLoading,
    error,
    getProfile,
    clearProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}


