export interface UserProfile {
  id: string;
  avatar: {
    id: number;
    high: string;
    medium: string;
    low: string;
  } | null;
  name: string;
  last_name: string;
  email: string;
}

export interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  getProfile: () => Promise<void>;
  clearProfile: () => void;
}