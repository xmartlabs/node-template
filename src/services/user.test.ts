import * as bcrypt from 'bcryptjs';
import { startOfYesterday } from 'date-fns';
import { faker } from '@faker-js/faker';

import prisma from 'root/prisma/client';
import { generateTokenData, generateUserData } from 'tests/utils/generateData';
import { UserService } from 'services/user';
import { addToMailQueue } from 'queue/queue';
import * as queues from 'queue/queue';
import { EmailTypes } from 'types';
import { ApiError } from 'utils/apiError';
import { errors } from 'config/errors';

jest.mock('emails/index');
jest.mock('queue/queue');

const mockAddToMailQueue = addToMailQueue as jest.Mock;

const mockCode = String(Math.floor(100000 + Math.random() * 900000));

const userData = generateUserData();

const tokenData = generateTokenData({
  userId: userData.id,
  token: bcrypt.hashSync(mockCode, 8),
});

describe('User service: ', () => {
  afterEach(jest.clearAllMocks);

  describe('create functionality', () => {
    test('should create a new user with email', async () => {
      mockAddToMailQueue.mockResolvedValue(undefined);

      await expect(UserService.create(userData)).resolves.toEqual({
        createdAt: expect.anything(),
        email: userData.email,
        id: expect.stringMatching(/^(\d|\w|-)+/),
        name: userData.name,
        updatedAt: expect.anything(),
      });

      expect(mockAddToMailQueue).toHaveBeenCalledWith('Sign up Email', {
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

        expect(mockAddToMailQueue).not.toHaveBeenCalled();
      });
    });
  });

  describe('Request reset password code', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should create and return new hash', async () => {
      await prisma.user.create({
        data: userData,
      });
      const { password, ...userWithoutPassword } = userData;

      await expect(UserService.find(userData.id)).resolves.toEqual(
        userWithoutPassword,
      );
    });

    test('user does not exist', async () => {
      await expect(UserService.find(faker.string.uuid())).rejects.toThrow(
        new ApiError(errors.NOT_FOUND_USER),
      );
    });
  });

  describe('update functionality', () => {
    test('should update user', async () => {
      const newName = faker.person.fullName();
      const updatedUser = {
        ...userData,
        name: newName,
      };

      await prisma.user.create({
        data: userData,
      });

      const { password, ...userWithoutPassword } = userData;

      await expect(
        UserService.update(userData.id, updatedUser),
      ).resolves.toEqual({
        ...userWithoutPassword,
        name: newName,
      });
    });

    describe('invalid data', () => {
      test('user with email does not exist', async () => {
        const spyAddToMailQueue = jest.spyOn(queues, 'addToMailQueue');
        await expect(
          UserService.requestResetPasswordCode(userData.email),
        ).resolves.toEqual(undefined);

        expect(spyAddToMailQueue).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('Reset Password', () => {
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
        ).resolves.toEqual(undefined);
      });

      test('token does not exist', async () => {
        await prisma.user.create({
          data: userData,
        });

        await expect(
          UserService.resetPassword(
            userData.email,
            mockCode,
            userData.password,
          ),
        ).rejects.toThrow(new ApiError(errors.INVALID_CODE));
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

        await expect(
          UserService.resetPassword(
            userData.email,
            mockCode,
            userData.password,
          ),
        ).rejects.toThrow(new ApiError(errors.CODE_EXPIRED));
      });
    });
    describe('find functionality', () => {
      test('should return user', async () => {
        await prisma.user.create({
          data: userData,
        });
        const { password, ...userWithoutPassword } = userData;

        await expect(UserService.find(userData.id)).resolves.toEqual(
          userWithoutPassword,
        );
      });

      test('user does not exist', async () => {
        await expect(UserService.find(faker.string.uuid())).rejects.toThrow(
          new ApiError(errors.NOT_FOUND_USER),
        );
      });
    });

    describe('update functionality', () => {
      test('should update user', async () => {
        const updatedUser = {
          ...userData,
          name: 'New name',
        };

        await prisma.user.create({
          data: userData,
        });

        const { password, ...userWithoutPassword } = userData;

        await expect(
          UserService.update(userData.id, updatedUser),
        ).resolves.toEqual(userWithoutPassword);
      });

      describe('invalid data', () => {
        test('user does not exist', async () => {
          await expect(
            UserService.update(userData.id, userData),
          ).rejects.toThrow(new ApiError(errors.NOT_FOUND_USER));
        });
      });
    });

    describe('update functionality', () => {
      test('should update user', async () => {
        await prisma.user.create({
          data: userData,
        });

        await expect(UserService.destroy(userData.id)).resolves.toEqual(
          undefined,
        );
      });

      describe('invalid data', () => {
        test('user does not exist', async () => {
          await expect(UserService.destroy(userData.id)).rejects.toThrow(
            new ApiError(errors.NOT_FOUND_USER),
          );
        });
      });
    });
  });
});
