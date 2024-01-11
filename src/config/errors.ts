export const errors = {
  INVALID_CREDENTIALS: {
    httpCode: 400,
    errorCode: 400_000,
    description: 'Invalid credentials',
  },
  INVALID_USER: {
    httpCode: 400,
    errorCode: 400_001,
    description: 'Invalid user',
  },
  INVALID_EMAIL: {
    httpCode: 400,
    errorCode: 400_002,
    description: 'Invalid email',
  },
  INVALID_TOKEN: {
    httpCode: 400,
    errorCode: 400_003,
    description: 'Invalid token',
  },
  INVALID_CODE: {
    httpCode: 400,
    errorCode: 400_004,
    description: 'Invalid code',
  },
  UNAUTHENTICATED: {
    httpCode: 401,
    errorCode: 401_000,
    description: 'Unauthorized',
  },
  EXPIRED_TOKEN: {
    httpCode: 401,
    errorCode: 401_001,
    description: 'Token expired',
  },
  CODE_EXPIRED: {
    httpCode: 403,
    errorCode: 403_001,
    description: 'Code has expired',
  },
  NOT_FOUND: {
    httpCode: 404,
    errorCode: 404_000,
    description: 'Not found',
  },
  NOT_FOUND_USER: {
    httpCode: 404,
    errorCode: 404_001,
    description: 'User not found',
  },
  USER_ALREADY_EXISTS: {
    httpCode: 409,
    errorCode: 409_000,
    description: 'User already exists',
  },
  VALIDATION_ERROR: {
    httpCode: 422,
    errorCode: 422_000,
    description: 'Validation error',
  },
  INTERNAL_SERVER_ERROR: {
    httpCode: 500,
    errorCode: 500_000,
    description: 'Internal server error',
  },
};
