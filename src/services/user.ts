import * as bcrypt from 'bcryptjs';
import { addMinutes } from 'date-fns';

import { Prisma, TypeHash } from '@prisma/client';
import prisma from 'root/prisma/client';
import { ApiError } from 'utils/apiError';
import {
  ReturnUser,
  CreateUserParams,
  UpdateUserParams,
  DatabaseUser,
  EmailTypes,
} from 'types';
import { sendUserWithoutPassword } from 'utils/user';
import { emailRegex } from 'utils/constants';
import { errors } from 'config/errors';
import { addToMailQueue } from 'queue/queue';
import { generateCodeAndHash, verifyHash } from 'utils/hash';
import { config } from 'config/config';
import { sendResetPasswordCode } from 'emails';

export class UserService {
  static find = async (id: string): Promise<ReturnUser | null> => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(errors.NOT_FOUND_USER);
    }
    return sendUserWithoutPassword(user);
  };

  static all = async (): Promise<ReturnUser[]> => {
    const users = await prisma.user.findMany();
    return users.map(sendUserWithoutPassword);
  };

  static create = async (userBody: CreateUserParams): Promise<ReturnUser> => {
    const { name, email, password } = userBody;

    let user: DatabaseUser | null = null;

    // Check if email is valid (from email-validator library)
    if (!emailRegex.test(email)) {
      throw new ApiError(errors.INVALID_EMAIL);
    }

    // Data transformation before calling the prisma service
    const cryptPassword = await bcrypt.hash(password, 8);

    const data = {
      name,
      email,
      password: cryptPassword,
    };

    try {
      user = await prisma.user.create({ data });
    } catch (e) {
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ApiError(errors.USER_ALREADY_EXISTS);
      }

      throw e;
    }

    addToMailQueue('Sign up Email', {
      emailType: EmailTypes.SIGN_UP,
      email,
    });

    return sendUserWithoutPassword(user);
  };

  static update = async (
    id: string,
    userData: UpdateUserParams,
  ): Promise<ReturnUser> => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(errors.NOT_FOUND_USER);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...userData,
        password: user.password,
      },
    });
    return sendUserWithoutPassword(updatedUser);
  };

  static destroy = async (id: string): Promise<void> => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new ApiError(errors.NOT_FOUND_USER);
    }

    await prisma.user.delete({ where: { id } });
  };

  static requestResetPasswordCode = async (email: string) => {
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
