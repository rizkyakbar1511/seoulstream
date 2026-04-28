import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buildParams = <T extends object>(request: T) => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(request)) {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  }

  return params;
};
