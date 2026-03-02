import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRPhone(value: string) {
  if (!value) return value;
  
  // Remove tudo que não for número
  const phoneNumber = value.replace(/\D/g, "");
  
  // Limita a 11 dígitos
  const phoneNumberLimited = phoneNumber.slice(0, 11);
  
  const { length } = phoneNumberLimited;
  
  if (length <= 2) {
    return phoneNumberLimited.length > 0 ? `(${phoneNumberLimited}` : phoneNumberLimited;
  }
  
  if (length <= 6) {
    return `(${phoneNumberLimited.slice(0, 2)}) ${phoneNumberLimited.slice(2)}`;
  }
  
  if (length <= 10) {
    return `(${phoneNumberLimited.slice(0, 2)}) ${phoneNumberLimited.slice(2, 6)}-${phoneNumberLimited.slice(6)}`;
  }
  
  return `(${phoneNumberLimited.slice(0, 2)}) ${phoneNumberLimited.slice(2, 7)}-${phoneNumberLimited.slice(7)}`;
}
