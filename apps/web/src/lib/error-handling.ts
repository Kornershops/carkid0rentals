export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network error occurred') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', public fields?: Record<string, string>) {
    super(message, 'VALIDATION_ERROR', 400, fields);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ServerError extends AppError {
  constructor(message = 'Server error occurred') {
    super(message, 'SERVER_ERROR', 500);
    this.name = 'ServerError';
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  if (typeof error === 'string') {
    return new AppError(error);
  }

  return new AppError('An unexpected error occurred');
}

export function getErrorMessage(error: unknown): string {
  const appError = handleError(error);
  return appError.message;
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof NetworkError || 
         (error instanceof Error && error.message.includes('network'));
}

export function isAuthError(error: unknown): boolean {
  return error instanceof AuthenticationError || 
         error instanceof AuthorizationError;
}

export function logError(error: unknown, context?: string) {
  const appError = handleError(error);
  
  console.error('[Error]', {
    context,
    name: appError.name,
    message: appError.message,
    code: appError.code,
    statusCode: appError.statusCode,
    details: appError.details,
    stack: appError.stack,
  });

  // In production, send to error tracking service (e.g., Sentry)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to error tracking service
  }
}
