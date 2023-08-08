import { ApiError } from 'utils/apiError';
import { errors } from 'config/errors';
import { sendEmail } from 'emails';
import { config } from 'config/config';
import { generateHashAndCode, verifyHash } from 'utils/hash';
import { HashTypes } from 'types/hash';
import * as bcrypt from 'bcryptjs';
import prisma from 'root/prisma/client';
import { UserService } from './user';

export class SessionService {
  static requestResetPasswordEmail = async (email: string) => {
    const user = await UserService.find(email);
    if (!user) {
      throw new ApiError(errors.NOT_FOUND_USER);
    }
    const newCode = await generateHashAndCode(
      email,
      HashTypes.RESET_PASSWORD,
      user.id,
    );
    await sendEmail(email, `${config.appName} one time use code`, newCode, '');
  };

  static resetPassword = async (
    email: string,
    code: string,
    password: string,
  ) => {
    const user = await UserService.find(email);
    if (!user) {
      throw new ApiError(errors.NOT_FOUND_USER);
    }
    const hash = await verifyHash(code, email, HashTypes.RESET_PASSWORD, user.id);
    const cryptPassword = await bcrypt.hash(password, 8);
    try {
      await prisma.$transaction([
        prisma.hash.delete({ where: { id: hash.id } }),
        prisma.user.update({
          where: { id: user.id },
          data: { password: cryptPassword },
        }),
      ]);
    } catch {
      throw new ApiError(errors.INTERNAL_SERVER_ERROR);
    }
  };
}
