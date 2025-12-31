import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Recursively removes undefined values from an object.
 * Useful for Firestore updates where undefined is not allowed.
 * Preserves special objects like Dates and Firestore Timestamps.
 */
export function deepClean<T>(obj: T): T {
  // Handle primitives and null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Dates
  if (obj instanceof Date) {
    return obj as unknown as T;
  }

  // Handle Firestore Timestamps (check for toDate method to avoid direct dependency if possible, 
  // but checking constructor name is also a common trick)
  if ((obj as any).constructor?.name === 'Timestamp' || typeof (obj as any).toDate === 'function') {
    return obj;
  }

  // Handle Arrays
  if (Array.isArray(obj)) {
    return obj.map(item => deepClean(item)) as unknown as T;
  }

  // Handle Plain Objects
  const result: any = {};
  Object.keys(obj as object).forEach(key => {
    const value = (obj as any)[key];
    if (value !== undefined) {
      result[key] = deepClean(value);
    }
  });

  return result;
}




