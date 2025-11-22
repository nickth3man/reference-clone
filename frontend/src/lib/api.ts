/**
 * API configuration and utilities
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

/**
 * Fetch data from the API
 * @param endpoint - The API endpoint (e.g., "/teams")
 * @param options - Fetch options
 * @returns Promise with the response data
 */
export async function fetchAPI<T = any>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
