import { CookieOptions } from 'express';

import { errors } from 'config/errors';
import prisma from 'root/prisma/client';
import { cookieEnabled, config, isProduction } from 'config/config';
import { ApiError } from './apiError';

export const COOKIE_NAME = 'token';

const SECONDS_TO_MILLISECONDS = 1000;

export const cookieConfig = {
  signed: true,
  httpOnly: true,
  maxAge: config.cookieExpirationSeconds * SECONDS_TO_MILLISECONDS,
  secure: isProduction,
} as CookieOptions;

export const verifyCookie = async (signedCookies: any) => {
  if (!cookieEnabled || !signedCookies || !signedCookies.token) {
    throw new ApiError(errors.UNAUTHENTICATED);
  }

  const session = await prisma.session.findUnique({
    where: {
      id: signedCookies.token,
    },
  });
  if (!session) throw new ApiError(errors.UNAUTHENTICATED);

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) throw new ApiError(errors.UNAUTHENTICATED);

  return { ...user, token: session.accessToken };
};
