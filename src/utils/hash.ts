import * as bcrypt from 'bcryptjs';
import { generate } from 'otp-generator';

import { TypeHash } from '@prisma/client';
import { errors } from 'config/errors';
import prisma from 'root/prisma/client';
import { ApiError } from './apiError';

export const generateCodeAndHash = async () => {
  const code = generate(6, {
    specialChars: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
  });

  const hash = await bcrypt.hash(code, 8);

  return { code, hash };
};

export const verifyHash = async (
  userId: string,
  hashType: TypeHash,
  code: string,
) => {
  const hash = await prisma.hash.findUnique({
    where: {
      userId_type: { userId, type: hashType },
    },
  });

  if (!hash || !bcrypt.compareSync(code, hash.hash)) {
    throw new ApiError(errors.INVALID_CODE);
  }

  if (hash.expiresAt < new Date()) {
    throw new ApiError(errors.CODE_EXPIRED);
  }

  return hash;
};
