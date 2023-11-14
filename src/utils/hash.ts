import * as bcrypt from 'bcryptjs';
import { errors } from 'config/errors';
import { addMinutes } from 'date-fns';
import prisma from 'root/prisma/client';
import { generateCode } from 'services/security';
import { ApiError } from 'utils/apiError';

export const generateOTPCode = async (
  userId: string,
) => {
  const now = new Date();
  let code = await prisma.oTP.findFirst({
    where: {
      userId,
    },
  });

  if (code && now < addMinutes(code.updatedAt, 1)) {
    throw new ApiError(errors.TOO_MANY_REQUESTS);
  }
  

  const newCode = generateCode();
  const expiresAt = addMinutes(now, 15);

  try {
    await prisma.oTP.upsert({
      create: {
        expiresAt,
        code: newCode,
        userId,
      },
      update: {
        code: newCode,
        expiresAt,
      },
      where: {  userId },

    });
  } catch (error) {
    throw new ApiError(errors.HASH_CREATION_FAILED);
  }

  return newCode;
};

export const verifyCode = async (
  code: string,
  userId: string,
) => {
  const otp = await prisma.otp.findFirst({
    where: {  userId },
  });
console.log('hash',otp)
  if (!otp) {
    throw new ApiError(errors.INVALID_USER);
  }

  const isCodeValid = await bcrypt.compare(code, otp.code);
  console.log('isCodeValid', isCodeValid)
  if (!isCodeValid || otp.expiresAt < new Date()) {
    throw new ApiError(isCodeValid ? errors.CODE_EXPIRED : errors.INVALID_CODE);
  }

  return code;
};
