import { prismaMock } from 'tests/prismaSetup';
import { generateUserData } from 'tests/utils/generateData';
import { UserService } from 'services/user';
import { sendUserWithoutPassword } from 'utils/user';
import { addToMailQueue } from 'queue/queue';
import { EmailTypes } from 'types';

jest.mock('utils/user');
jest.mock('queue/queue');

const mockMailQueueAdd = addToMailQueue as jest.Mock;
const mockSendUserWithoutPassword = sendUserWithoutPassword as jest.Mock;

describe('User service: ', () => {
  beforeEach(() => {
    mockMailQueueAdd.mockResolvedValue(undefined);
  });

  afterEach(jest.clearAllMocks);

  test('should create a new user with email', async () => {
    const userData = generateUserData();

    prismaMock.user.create.mockResolvedValue(userData);
    prismaMock.user.update.mockResolvedValue(userData);

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

  test('should not create a new user', async () => {
    const userData = generateUserData();
    const referenceError = new Error('something went wrong');

    prismaMock.user.create.mockRejectedValue(referenceError);

    await expect(UserService.create(userData)).rejects.toEqual(referenceError);
    expect(mockMailQueueAdd).toBeCalledTimes(0);
  });
});
