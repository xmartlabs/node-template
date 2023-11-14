import { ApiError } from 'utils/apiError';
import { errors } from 'config/errors';
import { sendEmail } from 'emails';
import { config } from 'config/config';
import { generateOTPCode, verifyCode } from 'utils/hash';
import * as bcrypt from 'bcryptjs';
import prisma from 'root/prisma/client';
import { UserService } from './user';

export class SessionService {
  static requestResetPasswordEmail = async (email: string) => {
    const user = await UserService.findByEmail(email);
    if (!user) {
      throw new ApiError(errors.USER_NOT_FOUND);
    }
    const code = await generateOTPCode(
      user.id,
    );
    await sendEmail(email, `${config.appName} one time use code`, code, '');
  };

  static resetPassword = async (
    email: string,
    code: string,
    password: string,
  ) => {
    const user = await UserService.findByEmail(email);
    if (!user) {
      throw new ApiError(errors.USER_NOT_FOUND);
    }

    let hash;
    try {
      hash = await verifyCode(code, user.id);
    } catch (error) {
      throw new ApiError(errors.INVALID_CODE);
    }

    const cryptPassword = await bcrypt.hash(password, 8);
    try {
      await prisma.$transaction([
        prisma.oTP.delete({ where: { id: hash.id } }),
        prisma.user.update({
          where: { id: user.id },
          data: { password: cryptPassword },
        }),
      ]);
    } catch (error) {
      throw new ApiError(errors.INTERNAL_SERVER_ERROR);
    }
  };
}
