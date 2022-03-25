import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/apiError';
import config from '../config/config';
import { appLogger } from '../config/logger';

export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || statusCode;
    error = new ApiError(statusCode, message, false, null, err.stack);
  }
  next(error);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err;
  if (!err.isOperational) {
    statusCode = statusCode || (err.toString().indexOf('Not found'))
      ? httpStatus.NOT_FOUND
      : httpStatus.INTERNAL_SERVER_ERROR;
    message = message || httpStatus.INTERNAL_SERVER_ERROR.toString();
  }

  const response = {
    code: statusCode,
    message,
    additionalInfo: err.additionalInfo,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    appLogger.error(err);
  }

  res.status(statusCode).send(response);
};
