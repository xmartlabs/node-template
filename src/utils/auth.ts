import { CookieOptions } from 'express';

import { errors } from 'config/errors';
import prisma from 'root/prisma/client';
import { config, isProduction } from 'config/config';
import { ApiError } from './apiError';

export const COOKIE_NAME = 'token';

const SECONDS_TO_MILLISECONDS = 1000;

type SignedCookie = {
  token: string;
};

export const cookieConfig: CookieOptions = {
  signed: true,
  httpOnly: true,
  maxAge: config.cookieExpirationSeconds * SECONDS_TO_MILLISECONDS,
  secure: isProduction,
};

export const verifyCookie = async (signedCookies: SignedCookie | null) => {
  if (!signedCookies || !signedCookies.token) {
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
