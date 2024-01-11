import * as bcrypt from 'bcryptjs';

import { TypeToken } from '@prisma/client';
import { errors } from 'config/errors';
import prisma from 'root/prisma/client';
import { ApiError } from './apiError';

const generateCode = (length: number) => {
  const digits = '0123456789';
  let OTP = '';

  for (let i = 0; i < length; i += 1) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  return OTP;
};

export const generateCodeAndHash = async () => {
  const code = generateCode(6);
  const hash = await bcrypt.hash(code, 8);

  return { code, hash };
};

export const verifyToken = async (
  userId: string,
  tokenType: TypeToken,
  code: string,
) => {
  const token = await prisma.tokens.findUnique({
    where: {
      userId_type: { userId, type: tokenType },
    },
  });

  if (!token || !bcrypt.compareSync(code, token.token)) {
    throw new ApiError(errors.INVALID_CODE);
  }

  if (token.expiresAt < new Date()) {
    throw new ApiError(errors.CODE_EXPIRED);
  }

  return token;
};
