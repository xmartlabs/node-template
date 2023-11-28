import { ErrorInterface } from 'types';

export class ApiError extends Error {
  httpCode;

  errorCode;

  isOperational;
  // Used to check if ApiError is called intentonally

  additionalInfo;

  constructor(
    error: ErrorInterface,
    isOperational: boolean = true,
    additionalInfo: any = null,
    stack = '',
  ) {
    super(error.description);
    this.httpCode = error.httpCode;
    this.errorCode = error.errorCode;
    this.isOperational = isOperational;
    this.additionalInfo = additionalInfo;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
