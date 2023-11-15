import { compare } from 'bcryptjs';
import { errors } from 'config/errors';
import MockDate from 'mockdate';
import { prismaMock } from 'tests/prismaSetup';
import { ApiError } from 'utils/apiError';
import { verifyCode } from 'utils/otpCode';
import { generateUserData } from 'tests/utils/generateData';
import { createStubHash } from '../../__mocks__/support/hash';

jest.mock('bcryptjs');

const stubExpiredHash = createStubHash();
const stubHash = createStubHash({ expiresAt: new Date('2022-05-25') });
const userData = generateUserData();

const mockFindFirst = jest.fn();
const mockCompare = compare as jest.Mock;

describe('verifyCode', () => {
  beforeAll(() => {
    MockDate.set('2022-01-25');
  });
  prismaMock.user.update.mockResolvedValue(userData);

  beforeEach(() => {
    prismaMock.user.create.mockResolvedValue(userData);
    mockFindFirst.mockResolvedValue(stubExpiredHash);
    mockCompare.mockReturnValue(true);
  });

  afterEach(jest.clearAllMocks);

  afterAll(MockDate.reset);

  describe('error cases', () => {
    it('can not find user', () => {
      mockFindFirst.mockResolvedValue(null);

      expect(
        verifyCode(
          '123456',
          userData.id,
        ),
      ).rejects.toThrowError(new ApiError(errors.INVALID_USER));
    });

   
  });
});
