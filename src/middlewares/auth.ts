import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { ApiError } from '../utils/apiError';
import { errors } from '../config/errors';

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
        reject(new ApiError(errors.unauthenticated));
      }
      jwt.verify(token, config.accessTokenSecret, (err: any, decoded: any) => {
        if (err) {
          if (err instanceof jwt.TokenExpiredError) {
            reject(new ApiError(errors.expiredToken));
          } else {
            reject(new ApiError(errors.invalidToken));
          }
        }
        resolve(decoded.user);
      });
    });
  }
  return Promise.resolve(null);
}
