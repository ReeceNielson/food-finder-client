/**
 * useApi - Custom hook that combines ApiService with AuthContext
 * Automatically provides the authentication token from the session
 */

import { useContext } from 'react'
import type { AuthContextType } from '../contexts/AuthContext'
import { AuthContext } from '../contexts/AuthContext'
import { apiService } from '../services/ApiService'


export function useApi() {
  const authContext = useContext(AuthContext)

  if (authContext === undefined) {
    throw new Error('useApi must be used within an AuthProvider')
  }

  const { session } = authContext as AuthContextType
  const token = session?.access_token || null

  return {
    /**
     * GET request with automatic token injection
     */
    get: <T = unknown>(endpoint: string) => apiService.get<T>(endpoint, token),

    /**
     * POST request with automatic token injection
     */
    post: <T = unknown>(endpoint: string, body: Record<string, unknown>) =>
      apiService.post<T>(endpoint, token, body),

    /**
     * PUT request with automatic token injection
     */
    put: <T = unknown>(endpoint: string, body: Record<string, unknown>) =>
      apiService.put<T>(endpoint, token, body),

    /**
     * PATCH request with automatic token injection
     */
    patch: <T = unknown>(endpoint: string, body: Record<string, unknown>) =>
      apiService.patch<T>(endpoint, token, body),

    /**
     * DELETE request with automatic token injection
     */
    delete: <T = unknown>(endpoint: string) => apiService.delete<T>(endpoint, token),

    /**
     * Check if user is authenticated
     */
    isAuthenticated: !!token,

    /**
     * Get the current token (for advanced use cases)
     */
    token,
  }
}
