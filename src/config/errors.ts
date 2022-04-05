export const errors = {
  invalidCredentials: {
    httpCode: 400,
    errorCode: 400_000,
    description: 'Invalid credentials',
  },
  invalidUser: {
    httpCode: 400,
    errorCode: 400_001,
    description: 'Invalid user',
  },
  invalidEmail: {
    httpCode: 400,
    errorCode: 400_002,
    description: 'Invalid email',
  },
  invalidToken: {
    httpCode: 400,
    errorCode: 400_003,
    description: 'Invalid token',
  },
  unauthenticated: {
    httpCode: 401,
    errorCode: 401_000,
    description: 'Unauthorized',
  },
  expiredToken: {
    httpCode: 401,
    errorCode: 401_001,
    description: 'Token expired',
  },
  notFound: {
    httpCode: 404,
    errorCode: 404_000,
    description: 'Not found',
  },
  notFoundUser: {
    httpCode: 404,
    errorCode: 404_001,
    description: 'User not found',
  },
  userAlreadyExists: {
    httpCode: 409,
    errorCode: 409_000,
    description: 'User already exists',
  },
  validationError: {
    httpCode: 422,
    errorCode: 422_000,
    description: 'Validation error',
  },
  internalServerError: {
    httpCode: 500,
    errorCode: 500_000,
    description: 'Internal server error',
  },
  userCreationFailed: {
    httpCode: 500,
    errorCode: 500_001,
    description: 'User creation failed',
  },
};
