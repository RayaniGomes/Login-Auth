import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge";
import { Location } from "react-router-dom";

// Função para combinar classes do Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para obter as iniciais do nome e sobrenome
export const getInitials = (name: string, lastName?: string) => {
  const initials = `${name.charAt(0)}${lastName?.charAt(0) || ""}`;
  return initials.toUpperCase();
};