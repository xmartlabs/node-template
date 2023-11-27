import { generateUserData } from 'tests/utils/generateData';
import { UserService } from 'services/user';
import { sendUserWithoutPassword } from 'utils/user';
import { addToMailQueue } from 'queue/queue';
import { EmailTypes } from 'types';
import { sendUserWithoutPassword, startSendEmailTask } from 'utils/user';
import prisma from 'root/prisma/client';
import { ApiError } from 'utils/apiError';
import { errors } from 'config/errors';

jest.mock('utils/user');
jest.mock('queue/queue');

const mockMailQueueAdd = addToMailQueue as jest.Mock;
const mockSendUserWithoutPassword = sendUserWithoutPassword as jest.Mock;
const mockStartSendEmailTask = startSendEmailTask as jest.Mock;

const userData = generateUserData();

describe('User service: ', () => {
  beforeEach(() => {
    mockMailQueueAdd.mockResolvedValue(undefined);
  });

  afterEach(jest.clearAllMocks);

  test('should create a new user with email', async () => {
    const userData = generateUserData();

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
