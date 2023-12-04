import { generateHashData, generateUserData } from 'tests/utils/generateData';
import { UserService } from 'services/user';
import { sendUserWithoutPassword } from 'utils/user';
import { addToMailQueue } from 'queue/queue';
import { EmailTypes } from 'types';
import prisma from 'root/prisma/client';
import { ApiError } from 'utils/apiError';
import { errors } from 'config/errors';
import * as bcrypt from 'bcryptjs';

import { prismaMock } from 'tests/prismaSetup';
import { sendResetPasswordCode } from 'emails';
import { faker } from '@faker-js/faker';
import { startOfYesterday } from 'date-fns';

jest.mock('utils/user');
jest.mock('queue/queue');

const mockMailQueueAdd = addToMailQueue as jest.Mock;
const mockSendUserWithoutPassword = sendUserWithoutPassword as jest.Mock;
const mockSendResetPasswordCode = sendResetPasswordCode as jest.Mock;

const mockCode = String(Math.floor(100000 + Math.random() * 900000));

const userData = generateUserData();
const hashData = generateHashData({
  userId: userData.id,
  hash: bcrypt.hashSync(mockCode, 8),
});

describe('User service: ', () => {
  beforeEach(() => {
    mockMailQueueAdd.mockResolvedValue(undefined);
  });

  afterEach(jest.clearAllMocks);

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

  describe('create function', () => {
    test('should create a new user with email', async () => {
      prismaMock.user.create.mockResolvedValue(userData);
      prismaMock.user.update.mockResolvedValue(userData);
      const { password, ...userWithoutPassword } = userData;
      mockSendUserWithoutPassword.mockResolvedValue(userWithoutPassword);
      await expect(UserService.create(userData)).resolves.toEqual(
        userWithoutPassword,
      );
    });

    test('should not create a new user', async () => {
      const referenceError = new Error('something went wrong');

      prismaMock.user.create.mockRejectedValue(referenceError);
      await expect(UserService.create(userData)).rejects.toEqual(
        referenceError,
      );
    });
  });

  describe('Request reset password code', () => {
    test('should create and return new hash', async () => {
      prismaMock.user.findUnique.mockResolvedValue(userData);
      prismaMock.hash.upsert.mockResolvedValue(hashData);
      mockSendResetPasswordCode.mockResolvedValue(undefined);
      await expect(
        UserService.requestResetPasswordCode(userData.email),
      ).resolves.toEqual(undefined);
    });

    describe('invalid data', () => {
      test('user with email does not exist', async () => {
        prismaMock.user.findUnique.mockResolvedValueOnce(null);
        await expect(
          UserService.requestResetPasswordCode(userData.email),
        ).rejects.toThrow(new ApiError(errors.INVALID_EMAIL));
      });
    });
  });

  describe('Reset Password', () => {
    beforeEach(() => {
      prismaMock.user.findUnique.mockResolvedValue(userData);
      prismaMock.hash.findUnique.mockResolvedValue(hashData);
      prismaMock.$transaction.mockResolvedValue(undefined);
    });

    test('should update the password successfully', async () => {
      await expect(
        UserService.resetPassword(userData.email, mockCode, userData.password),
      ).resolves.toEqual(undefined);
    });

    describe('invalid data', () => {
      test('user with email does not exist', async () => {
        const newPassword = faker.internet.password();
        prismaMock.user.findUnique.mockResolvedValueOnce(null);

        await expect(
          UserService.resetPassword(userData.email, mockCode, newPassword),
        ).rejects.toThrow(new ApiError(errors.INVALID_EMAIL));
      });

      test('code does not verify with hash', async () => {
        prismaMock.hash.findUnique.mockResolvedValueOnce(
          generateHashData({
            hash: 'wrong hash',
          }),
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
        prismaMock.hash.findUnique.mockResolvedValueOnce(
          generateHashData({
            hash: hashData.hash,
            expiresAt: startOfYesterday(),
          }),
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
