import { generateUserData } from 'tests/utils/generateData';
import { compareSync } from 'bcryptjs';
import { errors } from 'config/errors';
import MockDate from 'mockdate';
import { prismaMock } from 'tests/prismaSetup';
import { HashTypes } from 'types/hash';
import { ApiError } from 'utils/apiError';
import { verifyHash } from 'utils/hash';
import { createStubHash } from '../../__mocks__/support/hash';

jest.mock('bcryptjs');
jest.mock('services/db');

const stubExpiredHash = createStubHash();
const stubHash = createStubHash({ expiresAt: new Date('2022-05-25') });
const userData = generateUserData();

const mockFindFirst = jest.fn();

const mockCompareSync = compareSync as jest.Mock;
prismaMock.user.create.mockResolvedValue(userData);

describe('verifyHash', () => {
  beforeAll(() => {
    MockDate.set('2022-01-25');
  });

  beforeEach(() => {
    prismaMock.hash.findFirst.mockReturnValue(stubHash)
    mockFindFirst.mockResolvedValue(stubExpiredHash);
    mockCompareSync.mockReturnValue(true);
  });

  afterEach(jest.clearAllMocks);

  afterAll(MockDate.reset);

  describe('error cases', () => {
    it('can not find hash', () => {
      mockFindFirst.mockResolvedValue(null);

      expect(
        verifyHash(
          '123456',
          stubUser.email,
          HashTypes.UPDATE_EMAIL,
          stubUser.id,
        ),
      ).rejects.toThrowError(new ApiError(errors.INVALID_CODE));
    });

    it('code is not valid', () => {
      mockCompareSync.mockReturnValue(false);

      expect(
        verifyHash(
          '123456',
          stubUser.email,
          HashTypes.UPDATE_EMAIL,
          stubUser.id,
        ),
      ).rejects.toThrowError(new ApiError(errors.INVALID_CODE));
    });

    it('code has expired', () => {
      expect(
        verifyHash(
          '123456',
          stubUser.email,
          HashTypes.UPDATE_EMAIL,
          stubUser.id,
        ),
      ).rejects.toThrowError(new ApiError(errors.CODE_EXPIRED));
    });
  });

  it('success case', async () => {
    mockFindFirst.mockResolvedValue(stubHash);

    await expect(
      verifyHash('123456', stubUser.email, HashTypes.UPDATE_EMAIL),
    ).resolves.toEqual(stubHash);

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        sentTo: stubUser.email,
        type: HashTypes.UPDATE_EMAIL,
        userId: undefined,
      },
    });
  });
});
