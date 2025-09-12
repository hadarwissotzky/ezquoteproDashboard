import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function createPageUrl(pageName) {
  const basePages = {
    Dashboard: '/dashboard',
    Analytics: '/analytics',
    Geographic: '/geographic',
    Usage: '/usage',
    Documents: '/documents',
    CustomerSuccess: '/customer-success'
  };
  
  return basePages[pageName] || '/';
}