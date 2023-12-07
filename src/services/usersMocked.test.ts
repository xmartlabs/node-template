import { prismaMock } from 'tests/prismaSetup';
import { generateUserData } from 'tests/utils/generateData';
import { UserService } from 'services/user';
import { sendUserWithoutPassword } from 'utils/user';

jest.mock('emails/index');
jest.mock('utils/user');
jest.mock('queue/queue');

const userData = generateUserData();

/*
Currently leaving this file to have an example of a test with prisma mocked.
Might delete this when we add the test for the rest of the functionalities,
since we might have a test with prisma mocked in there.
*/

describe('User service: ', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new user with email', async () => {
    prismaMock.user.create.mockResolvedValue(userData);
    prismaMock.user.update.mockResolvedValue(userData);

    const userWithoutPassword = sendUserWithoutPassword(userData);

    await expect(UserService.create(userData)).resolves.toEqual(
      userWithoutPassword,
    );
  });

  describe('When the user already exists', () => {
    test('should not create a new user', async () => {
      const referenceError = new Error('something went wrong');

      prismaMock.user.create.mockRejectedValue(referenceError);
      await expect(UserService.create(userData)).rejects.toEqual(
        referenceError,
      );
    });
  });
});
