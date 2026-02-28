/**
 * ApiService - Handles all API requests to the backend server
 * Automatically includes authentication token from session in request headers
 */

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: Record<string, unknown> | null
  headers?: Record<string, string>
}

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  status: number
}

class ApiService {
  private serverUrl: string = SERVER_URL

  /**
   * Make an authenticated API request
   * @param endpoint - The API endpoint (e.g., '/api/events/', '/api/user/')
   * @param token - The authentication token from the session
   * @param options - Request options (method, body, headers)
   * @returns Promise with the response data
   */
  private async request<T = unknown>(
    endpoint: string,
    token: string | null,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', body = null, headers = {} } = options

    const url = `${this.serverUrl}${endpoint}`

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    }

    // Add authentication token if provided
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`
    }

    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
    }

    // Add body for POST, PUT, PATCH requests
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(url, fetchOptions)
      const data = await response.json()

      return {
        success: response.ok,
        data: data,
        status: response.status,
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'

      return {
        success: false,
        error: errorMessage,
        status: 0,
      }
    }
  }

  /**
   * GET request
   * @param endpoint - The API endpoint
   * @param token - Authentication token
   * @returns Promise with response data
   */
  async get<T = unknown>(endpoint: string, token: string | null): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, token, { method: 'GET' })
  }

  /**
   * POST request
   * @param endpoint - The API endpoint
   * @param token - Authentication token
   * @param body - Request payload
   * @returns Promise with response data
   */
  async post<T = unknown>(
    endpoint: string,
    token: string | null,
    body: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, token, { method: 'POST', body })
  }

  /**
   * PUT request
   * @param endpoint - The API endpoint
   * @param token - Authentication token
   * @param body - Request payload
   * @returns Promise with response data
   */
  async put<T = unknown>(
    endpoint: string,
    token: string | null,
    body: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, token, { method: 'PUT', body })
  }

  /**
   * PATCH request
   * @param endpoint - The API endpoint
   * @param token - Authentication token
   * @param body - Request payload
   * @returns Promise with response data
   */
  async patch<T = unknown>(
    endpoint: string,
    token: string | null,
    body: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, token, { method: 'PATCH', body })
  }

  /**
   * DELETE request
   * @param endpoint - The API endpoint
   * @param token - Authentication token
   * @returns Promise with response data
   */
  async delete<T = unknown>(endpoint: string, token: string | null): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, token, { method: 'DELETE' })
  }
}

export const apiService = new ApiService()
