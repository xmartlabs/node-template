import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

import { AuthService } from 'services/auth';
import prisma from 'root/prisma/client';
import {
  generateSessionData,
  generateUserData,
} from 'tests/utils/generateData';
import { generateAccessToken, generateRefreshToken } from 'utils/token';
import { ApiError } from 'utils/apiError';
import { errors } from 'config/errors';

const userData = generateUserData();
const hashedPassword = bcrypt.hashSync(userData.password, 8);
const { id, createdAt, updatedAt, ...registerBody } = userData;
const loginParams = {
  email: userData.email,
  password: userData.password,
};

const mockAccessToken = faker.string.alphanumeric({
  length: 50,
});
const mockRefreshToken = faker.string.alphanumeric({
  length: 50,
});
const sessionData = generateSessionData({
  accessToken: mockAccessToken,
  refreshToken: mockRefreshToken,
  userId: userData.id,
});

jest.mock('queue/queue');
jest.mock('utils/token');

const mockGenerateAccessToken = generateAccessToken as jest.Mock;
const mockGenerateRefreshToken = generateRefreshToken as jest.Mock;

describe('Auth service: ', () => {
  mockGenerateAccessToken.mockResolvedValue(mockAccessToken);
  mockGenerateRefreshToken.mockResolvedValue(mockRefreshToken);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register functionality', () => {
    test('should create new user', async () => {
      await expect(AuthService.register(registerBody)).resolves.toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
    });

    describe('User already exist', () => {
      test('should throw an error', async () => {
        await prisma.user.create({
          data: registerBody,
        });

        await expect(AuthService.register(registerBody)).rejects.toThrowError(
          new ApiError(errors.USER_ALREADY_EXISTS),
        );
      });
    });
  });

  describe('login functionality', () => {
    describe('User exists', () => {
      beforeEach(async () => {
        await prisma.user.create({
          data: {
            ...userData,
            password: hashedPassword,
          },
        });
      });

      test('should login successfully', async () => {
        await expect(AuthService.login(loginParams)).resolves.toEqual({
          accessToken: mockAccessToken,
          refreshToken: mockRefreshToken,
        });
      });

      test('wrong password', async () => {
        await expect(
          AuthService.login({
            ...loginParams,
            password: `${loginParams.password} wrong`,
          }),
        ).rejects.toThrow(new ApiError(errors.INVALID_CREDENTIALS));
      });
    });

    test('wrong email', async () => {
      await expect(AuthService.login(loginParams)).rejects.toThrow(
        new ApiError(errors.INVALID_CREDENTIALS),
      );
    });
  });

  describe('refresh functionality', () => {
    test('should refresh access token successfully', async () => {
      await prisma.user.create({
        data: userData,
      });
      await prisma.session.create({
        data: sessionData,
      });

      await expect(
        AuthService.refresh({
          refreshToken: mockRefreshToken,
        }),
      ).resolves.toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
    });

    test('session does not exist', async () => {
      await expect(
        AuthService.refresh({
          refreshToken: mockRefreshToken,
        }),
      ).rejects.toThrow(new ApiError(errors.UNAUTHENTICATED));
    });

    test('user does not exist', async () => {
      await prisma.session.create({
        data: sessionData,
      });

      await expect(
        AuthService.refresh({
          refreshToken: mockRefreshToken,
        }),
      ).rejects.toThrow(new ApiError(errors.NOT_FOUND_USER));
    });
  });
});
