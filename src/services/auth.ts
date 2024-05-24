import * as bcrypt from 'bcryptjs';
import { getAuth } from 'firebase-admin/auth';
import { Prisma, SignUpMethod } from '@prisma/client';
import { faker } from '@faker-js/faker';

import {
  ReturnAuth,
  CreateUserParams,
  LoginParams,
  RefreshTokenParams,
  EmailTypes,
  DatabaseUser,
} from 'types';
import prisma from 'root/prisma/client';
import { ApiError } from 'utils/apiError';
import { errors } from 'config/errors';
import { generateAccessToken, generateRefreshToken } from 'utils/token';
import { SocialAuth } from 'types/auth';
import { addToMailQueue } from 'queue/queue';
import { UserService } from '.';

export class AuthService {
  static register = async (userBody: CreateUserParams): Promise<ReturnAuth> => {
    const user = await UserService.create(userBody);
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    const sessionData = {
      userId: user.id,
      accessToken,
      refreshToken,
    };
    await prisma.session.create({ data: sessionData });
    return {
      accessToken,
      refreshToken,
    };
  };

  static login = async (loginParams: LoginParams): Promise<ReturnAuth> => {
    const { email, password } = loginParams;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError(errors.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(errors.INVALID_CREDENTIALS);
    }
    const session = await prisma.session.findUnique({
      where: { userId: user.id },
    });
    const accessToken = await generateAccessToken(user);
    if (session) {
      await prisma.session.update({
        where: { id: session.id },
        data: { accessToken },
      });
      return {
        accessToken,
        refreshToken: session.refreshToken,
      };
    }

    const refreshToken = await generateRefreshToken(user);
    const sessionData = {
      userId: user.id,
      accessToken,
      refreshToken,
    };
    await prisma.session.create({ data: sessionData });
    return {
      accessToken,
      refreshToken,
    };
  };

  static firebaseAuth = async (idToken: SocialAuth): Promise<ReturnAuth> => {
    const decodeValue = await getAuth().verifyIdToken(idToken.idToken);
    const { email, name } = decodeValue;

    if (!email) throw new ApiError(errors.INVALID_CREDENTIALS);

    const cryptPassword = await bcrypt.hash(
      faker.internet.password({ length: 30 }),
      8,
    );
    const data = {
      name,
      email,
      password: cryptPassword,
      signUpMethod: SignUpMethod.GOOGLE,
    };

    let user: DatabaseUser | null = null;
    let userAlreadyExist = false;

    try {
      user = await prisma.user.create({ data });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        userAlreadyExist = true;
      }

      if (!user) throw e;
    }

    if (!userAlreadyExist) {
      addToMailQueue('Sign up Email', {
        emailType: EmailTypes.SIGN_UP,
        email,
      });
    }

    const session = await prisma.session.findUnique({
      where: { userId: user.id },
    });
    const accessToken = await generateAccessToken(user);

    if (session) {
      await prisma.session.update({
        where: { id: session.id },
        data: { accessToken },
      });

      return {
        accessToken,
        refreshToken: session.refreshToken,
      };
    }

    const refreshToken = await generateRefreshToken(user);
    const sessionData = {
      userId: user.id,
      accessToken,
      refreshToken,
    };
    await prisma.session.create({ data: sessionData });

    return {
      accessToken,
      refreshToken,
    };
  };

  static logout = async (accessToken: string): Promise<void> => {
    await prisma.session.delete({ where: { accessToken } });
  };

  static refresh = async (
    refreshTokenParams: RefreshTokenParams,
  ): Promise<ReturnAuth> => {
    const { refreshToken } = refreshTokenParams;
    const session = await prisma.session.findUnique({
      where: { refreshToken },
    });
    if (!session) {
      throw new ApiError(errors.UNAUTHENTICATED);
    }
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });
    if (!user) {
      throw new ApiError(errors.NOT_FOUND_USER);
    }

    const accessToken = await generateAccessToken(user);
    await prisma.session.update({
      where: { userId: user.id },
      data: { accessToken },
    });
    return {
      accessToken,
      refreshToken,
    };
  };
}
