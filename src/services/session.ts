import * as bcrypt from 'bcryptjs';
import { addMinutes } from 'date-fns';

import { ApiError } from 'utils/apiError';
import { errors } from 'config/errors';
import { emailRegex } from 'utils/constants';
import { generateCodeAndHash, verifyHash } from 'utils/hash';
import prisma from 'root/prisma/client';
import { TypeHash } from '@prisma/client';
import { config } from 'config/config';
import { sendResetPasswordCode } from 'emails';

export class SessionService {
  static requestResetPasswordCode = async (email: string) => {
    if (!emailRegex.test(email)) {
      throw new ApiError(errors.INVALID_EMAIL);
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new ApiError(errors.INVALID_EMAIL);

    const { code, hash } = await generateCodeAndHash();
    const expirationDate = addMinutes(new Date(), config.otpExpirationTime);

    await prisma.hash.upsert({
      create: {
        userId: user.id,
        hash,
        expiresAt: expirationDate,
        type: TypeHash.RESET_PASSWORD,
      },
      update: {
        hash,
        expiresAt: expirationDate,
        userId: user.id,
      },
      where: {
        userId_type: {
          userId: user.id,
          type: TypeHash.RESET_PASSWORD,
        },
      },
    });

    await sendResetPasswordCode(email, code);
  };

  static resetPassword = async (
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new ApiError(errors.INVALID_EMAIL);

    const hash = await verifyHash(user.id, TypeHash.RESET_PASSWORD, code);
    const hashedNewPassword = await bcrypt.hash(newPassword, 8);

    await prisma.$transaction([
      prisma.hash.delete({ where: { id: hash.id } }),
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedNewPassword },
      }),
    ]);
  };
}
