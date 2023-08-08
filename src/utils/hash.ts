import * as bcrypt from 'bcryptjs';
import { errors } from 'config/errors';
import { addMinutes } from 'date-fns';
import prisma from 'root/prisma/client';
import { generateCode } from 'services/security';
import { HashTypes } from 'types/hash';
import { ApiError } from 'utils/apiError';

export const generateHashAndCode = async (
  sentTo: string,
  hashType: HashTypes,
  userId?: string,
) => {
  const hash = await prisma.hash.findFirst({
    where: {
      sentTo,
      type: hashType,
      userId,
    },
  });

  if (hash && new Date() < addMinutes(hash.updatedAt, 1)) {
    throw new ApiError(errors.TOO_MANY_REQUESTS);
  }

  const newCode = generateCode();

  const newHash = await bcrypt.hash(newCode, 8);

  try {
    await prisma.hash.upsert({
      create: {
        sentTo,
        expiresAt: addMinutes(new Date(), 15),
        hash: newHash,
        type: hashType,
        userId,
      },
      update: {
        hash: newHash,
        expiresAt: addMinutes(new Date(), 15),
        userId,
      },
      where: {
        sentTo_type: { sentTo, type: hashType },
      },
    });
  } catch {
    throw new ApiError(errors.HASH_CREATION_FAILED);
  }

  return newCode;
};

export const verifyHash = async (
  code: string,
  sentTo: string,
  hashType: HashTypes,
  userId?: string,
) => {
  const hash = await prisma.hash.findFirst({
    where: { sentTo, type: hashType, userId },
  });

  if (!hash) {
    throw new ApiError(errors.INVALID_CODE);
  }

  if (!bcrypt.compareSync(code, hash.hash)) {
    throw new ApiError(errors.INVALID_CODE);
  }

  if (hash.expiresAt < new Date()) {
    throw new ApiError(errors.CODE_EXPIRED);
  }

  return hash;
};
