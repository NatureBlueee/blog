export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class PostError extends AppError {
  constructor(message: string, code: string) {
    super(message, `POST_${code}`, 500)
    this.name = 'PostError'
  }
}

export class AuthError extends AppError {
  constructor(message: string, code: string) {
    super(message, `AUTH_${code}`, 401)
    this.name = 'AuthError'
  }
}
