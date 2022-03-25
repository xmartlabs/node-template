export default class ApiError extends Error {
  statusCode;
  // Used to check if ApiError is called intentonally

  isOperational;

  additionalInfo;

  constructor(statusCode: number, message: string, isOperational: boolean = true, additionalInfo: any = null, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.additionalInfo = additionalInfo;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
