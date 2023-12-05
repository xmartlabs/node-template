import { startOfYesterday } from 'date-fns';
import { faker } from '@faker-js/faker';

import prisma from 'root/prisma/client';
import { generateTokenData, generateUserData } from 'tests/utils/generateData';
import { UserService } from 'services/user';
import { sendUserWithoutPassword } from 'utils/user';
import { addToMailQueue } from 'queue/queue';
import { EmailTypes } from 'types';
import { ApiError } from 'utils/apiError';
import { errors } from 'config/errors';
import { verifyToken, generateCodeAndHash } from 'utils/hash';

jest.mock('utils/user');
jest.mock('queue/queue');
jest.mock('utils/hash');

const mockMailQueueAdd = addToMailQueue as jest.Mock;
const mockSendUserWithoutPassword = sendUserWithoutPassword as jest.Mock;
const mockGenerateCodeAndHash = generateCodeAndHash as jest.Mock;
const mockVerifyToken = verifyToken as jest.Mock;

const mockCode = String(Math.floor(100000 + Math.random() * 900000));

const userData = generateUserData();
const tokenData = generateTokenData({
  userId: userData.id,
  token: mockCode,
});

describe('User service: ', () => {
  beforeEach(() => {
    mockMailQueueAdd.mockResolvedValue(undefined);
  });

  afterEach(jest.clearAllMocks);

  describe('create function', () => {
    test('should create a new user with email', async () => {
      const { password, ...userWithoutPassword } = userData;
      mockSendUserWithoutPassword.mockResolvedValue(userWithoutPassword);

      await expect(UserService.create(userData)).resolves.toEqual(
        userWithoutPassword,
      );

      expect(mockMailQueueAdd).toHaveBeenCalledWith('Sign up Email', {
        emailType: EmailTypes.SIGN_UP,
        email: userData.email,
      });
    });

    describe('When the user already exists', () => {
      beforeEach(async () => {
        await prisma.user.create({
          data: userData,
        });
      });

      test('should not create a new user', async () => {
        const referenceError = new ApiError(errors.USER_ALREADY_EXISTS);

        await expect(UserService.create(userData)).rejects.toEqual(
          referenceError,
        );
      });
    });
  });

  describe('Request reset password code', () => {
    beforeEach(async () => {
      mockGenerateCodeAndHash.mockResolvedValue({
        code: mockCode,
        hash: tokenData.token,
      });
    });

    test('should create and return new hash', async () => {
      await prisma.user.create({
        data: userData,
      });

      await expect(
        UserService.requestResetPasswordCode(userData.email),
      ).resolves.toEqual(undefined);

      expect(mockMailQueueAdd).toHaveBeenCalledWith('Reset password code', {
        emailType: EmailTypes.RESET_PASSWORD_CODE,
        email: userData.email,
        code: mockCode,
      });
    });

    describe('invalid data', () => {
      test('user with email does not exist', async () => {
        await expect(
          UserService.requestResetPasswordCode(userData.email),
        ).rejects.toThrow(new ApiError(errors.INVALID_EMAIL));

        expect(mockMailQueueAdd).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('Reset Password', () => {
    mockVerifyToken.mockResolvedValue(tokenData);

    test('should update the password successfully', async () => {
      await prisma.user.create({
        data: userData,
      });
      await prisma.tokens.create({
        data: tokenData,
      });

      await expect(
        UserService.resetPassword(userData.email, mockCode, userData.password),
      ).resolves.toEqual(undefined);
    });

    describe('invalid data', () => {
      test('user with email does not exist', async () => {
        const newPassword = faker.internet.password();

        await expect(
          UserService.resetPassword(userData.email, mockCode, newPassword),
        ).rejects.toThrow(new ApiError(errors.INVALID_EMAIL));
      });

      test('code does not verify with hash', async () => {
        await prisma.user.create({
          data: userData,
        });
        await prisma.tokens.create({
          data: generateTokenData({
            token: 'wrong token',
            userId: userData.id,
          }),
        });

        mockVerifyToken.mockRejectedValueOnce(
          new ApiError(errors.INVALID_CODE),
        );

        await expect(
          UserService.resetPassword(
            userData.email,
            mockCode,
            userData.password,
          ),
        ).rejects.toThrow(new ApiError(errors.INVALID_CODE));
      });

      test('code is expired', async () => {
        await prisma.user.create({
          data: userData,
        });
        await prisma.tokens.create({
          data: generateTokenData({
            token: tokenData.token,
            expiresAt: startOfYesterday(),
            userId: userData.id,
          }),
        });

        mockVerifyToken.mockRejectedValueOnce(
          new ApiError(errors.CODE_EXPIRED),
        );

        await expect(
          UserService.resetPassword(
            userData.email,
            mockCode,
            userData.password,
          ),
        ).rejects.toThrow(new ApiError(errors.CODE_EXPIRED));
      });
    });
  });
});
