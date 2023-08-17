import { prismaMock } from 'tests/prismaSetup';
import { generateUserData } from 'tests/utils/generateData';
import { UserService } from 'services/user';
import { errors } from 'config/errors';
import { sendUserWithoutPassword ,startSendEmailTask } from 'utils/user';

jest.mock('emails/index');
jest.mock('utils/user');

const mockStartSendEmailTask = startSendEmailTask as jest.Mock;
const mockSendUserWithoutPassword = sendUserWithoutPassword as jest.Mock;

describe('User service: ', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should create a new user with email', async () => {
    const userData = generateUserData();

    prismaMock.user.create.mockResolvedValue(userData);
    prismaMock.user.update.mockResolvedValue(userData);
    mockStartSendEmailTask.mockResolvedValue(undefined);
    const {
      password, ...userWithoutPassword
    } = userData;
    mockSendUserWithoutPassword.mockResolvedValue(userWithoutPassword)
    await expect(UserService.create(userData)).resolves.toEqual(userWithoutPassword);
  });

  test('should not create a new user', async () => {
    const userData = generateUserData();
    // @ts-ignore
    prismaMock.user.create.mockRejectedValue(new Error(errors.USER_CREATION_FAILED));
    await expect(
      UserService.create(userData),
    ).rejects.toEqual(new Error(`${errors.USER_CREATION_FAILED.description}`));
  });
});
