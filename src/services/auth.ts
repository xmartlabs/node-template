import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { config } from 'config/config';
import {
  ReturnAuth,
  CreateUserParams,
  ReturnUser,
  LoginParams,
  RefreshTokenParams,
} from 'types';
import prisma from 'root/prisma/client';
import { ApiError } from 'utils/apiError';
import { errors } from 'config/errors';
import { UserService } from '.';

export class AuthService {
  static register = async (userBody: CreateUserParams): Promise<ReturnAuth> => {
    const user = await UserService.create(userBody);
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
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
    const accessToken = await this.generateAccessToken(user);
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

    const refreshToken = await this.generateRefreshToken(user);
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
    refreshTokenParams: RefreshTokenParams
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

    const accessToken = await this.generateAccessToken(user);
    await prisma.session.update({
      where: { userId: user.id },
      data: { accessToken },
    });
    return {
      accessToken,
      refreshToken,
    };
  };

  static generateAccessToken = async (user: ReturnUser): Promise<string> =>
    jwt.sign({ user }, config.accessTokenSecret, {
      expiresIn: config.accessTokenExpiresIn,
    });

  static generateRefreshToken = async (user: ReturnUser): Promise<string> =>
    jwt.sign({ user }, config.refreshTokenSecret, {
      expiresIn: config.refreshTokenExpiresIn,
    });
}
