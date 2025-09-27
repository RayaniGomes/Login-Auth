import { api } from "./api";
import { UserProfile } from "@/interfaces/profile.interface";

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>("/auth/profile/");
  return response.data;
};
