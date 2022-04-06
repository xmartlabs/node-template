import { Request } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { ApiError } from '../utils/apiError';

export function expressAuthentication(
  request: Request,
  securityName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scopes?: string[],
): Promise<any> {
  if (securityName === 'jwt') {
    const token = request.headers.authorization!;

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new ApiError(httpStatus.UNAUTHORIZED, 'No token provided'));
      }
      jwt.verify(token, config.accessTokenSecret, (err: any, decoded: any) => {
        if (err) {
          if (err instanceof jwt.TokenExpiredError) {
            reject(new ApiError(httpStatus.UNAUTHORIZED, 'Token expired'));
          } else {
            reject(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token'));
          }
        }
        resolve(decoded.user);
      });
    });
  }
  return Promise.resolve(null);
}
