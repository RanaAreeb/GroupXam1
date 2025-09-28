import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a full name to show only first name and last initial (e.g., "Mustapha J.")
 * @param fullName - The full name to format
 * @returns Formatted name with first name and last initial
 */
export function formatTestimonialName(fullName: string): string {
  if (!fullName || typeof fullName !== 'string') {
    return fullName || '';
  }
  
  const nameParts = fullName.trim().split(/\s+/);
  
  if (nameParts.length === 1) {
    // Only one name part, return as is
    return nameParts[0];
  }
  
  if (nameParts.length === 2) {
    // First name + Last name, return "FirstName L."
    const firstName = nameParts[0];
    const lastName = nameParts[1];
    return `${firstName} ${lastName.charAt(0).toUpperCase()}.`;
  }
  
  // Multiple name parts, take first and last
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  return `${firstName} ${lastName.charAt(0).toUpperCase()}.`;
}
