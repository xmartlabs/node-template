import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { ValidateError } from 'tsoa';
import { ApiError } from 'utils/apiError';
import { isDevelopment } from 'config/config';
import { appLogger } from 'config/logger';
import { errors } from 'config/errors';

export const errorConverter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err;
  if (error instanceof ValidateError) {
    error = new ApiError(errors.VALIDATION_ERROR, true, err.fields);
  } else if (!(error instanceof ApiError)) {
    error = new ApiError(errors.INTERNAL_SERVER_ERROR, false, null, err.stack);
  }
  next(error);
};

export const errorHandler = (err: ApiError, req: Request, res: Response) => {
  let { httpCode, message } = err;
  if (!err.isOperational) {
    httpCode =
      httpCode || err.toString().indexOf('Not found')
        ? httpStatus.NOT_FOUND
        : httpStatus.INTERNAL_SERVER_ERROR;
    message = message || httpStatus.INTERNAL_SERVER_ERROR.toString();
  }

  const response = {
    errorCode: err.errorCode,
    message,
    additionalInfo: err.additionalInfo,
    ...(isDevelopment && { stack: err.stack }),
  };

  if (isDevelopment) {
    appLogger.error(err.stack);
  }

  res.status(httpCode).send(response);
};
