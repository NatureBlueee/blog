export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return '发生未知错误'
}

export const handleError = handleApiError

export const ErrorMessages = {
  NOT_FOUND: '未找到请求的资源',
  UNAUTHORIZED: '未经授权的访问',
  FORBIDDEN: '禁止访问该资源',
  VALIDATION_ERROR: '输入验证失败',
  INTERNAL_ERROR: '服务器内部错误',
} as const 