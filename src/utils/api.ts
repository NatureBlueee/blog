export interface ApiResponse<T = any> {
  data?: T
  error?: string
  code?: string
  status: number
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 400
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function fetchApi<T>(
  url: string, 
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(
        data.error || '请求失败',
        data.code || 'UNKNOWN_ERROR',
        response.status
      )
    }

    return {
      data,
      status: response.status
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    throw new ApiError(
      '网络请求失败',
      'NETWORK_ERROR',
      500
    )
  }
} 