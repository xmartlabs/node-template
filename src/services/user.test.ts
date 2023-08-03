import { prismaMock } from 'tests/prismaSetup';
import { generateUserData } from 'tests/utils/generateData';
import { UserService } from 'services/user';
import { errors } from 'config/errors';
import { sendSignUpEmail } from 'emails/index';

jest.mock('emails/index');

const mockSendSignUpEmail = sendSignUpEmail as jest.Mock;

describe('User service: ', () => {
  test('should create a new user with email', async () => {
    const userData = generateUserData();
    // @ts-ignore
    prismaMock.user.create.mockResolvedValue(userData);
    prismaMock.user.update.mockResolvedValue(userData);
    mockSendSignUpEmail.mockResolvedValue(undefined);
  
    const {
      password, ...userWithoutPassword
    } = userData;
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
