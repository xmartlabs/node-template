import { ApiError } from 'utils/apiError';
import { errors } from 'config/errors';
import { sendEmail } from 'emails';
import { config } from 'config/config';
import { generateOTPCode, verifyCode } from 'utils/otpCode';
import * as bcrypt from 'bcryptjs';
import prisma from 'root/prisma/client';
import { emailRegex } from 'utils/constants';
import { UserService } from './user';

export class SessionService {
  static requestResetPasswordEmail = async (email: string) => {
    if (!emailRegex.test(email)) {
      throw new ApiError(errors.INVALID_EMAIL);
    }
    const user = await UserService.findByEmail(email);

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

    await verifyCode(code, user.id);

    const cryptPassword = await bcrypt.hash(password, 8);
    await prisma.$transaction(async () => {
      await prisma.otpCode.delete({ where: { userId: user.id } });
      await prisma.user.update({
        where: { id: user.id },
        data: { password: cryptPassword },
      });
    }).catch((error) => {
      throw error;
    });
  };
}
