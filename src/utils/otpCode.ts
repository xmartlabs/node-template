import { addMinutes } from 'date-fns';
import prisma from 'root/prisma/client';
import { generateCode } from 'services/security';
import { ApiError } from 'utils/apiError';
import { config } from 'config/config';
import { errors } from 'config/errors';

export const generateOTPCode = async (userId: string) => {
  const now = new Date();

  const otpCode = await prisma.otpCode.findFirst({ where: { userId } });
  if (otpCode && otpCode.expiresAt > now) {
    throw new ApiError(errors.UNVALIDATED_CODE_ALREADY_EXISTS);
  }

  const expiresAt = addMinutes(now, config.otpCodeExpiresInMinutes);
  const code = generateCode();

  await prisma.otpCode.upsert({
    where: { userId },
    update: { expiresAt, code },
    create: { userId, expiresAt, code },
  });
  return code;
};

export const verifyCode = async (code: string, userId: string) => {
  const otpCode = await prisma.otpCode.findFirst({ where: { userId } });

  if (!otpCode) {
    throw new ApiError(errors.INVALID_USER);
  }
  if (otpCode.expiresAt < new Date()) {
    throw new ApiError(errors.CODE_EXPIRED);
  }
  if (otpCode.code !== code) {
    throw new ApiError(errors.INVALID_CODE);
  }

  return true;
};
