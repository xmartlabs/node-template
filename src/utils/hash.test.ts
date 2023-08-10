import { compareSync } from 'bcryptjs';
import { errors } from 'config/errors';
import MockDate from 'mockdate';
import { prismaMock } from 'tests/prismaSetup';
// import { client } from 'services/db';
import { HashTypes } from 'types/hash';
import { ApiError } from 'utils/apiError';
import { verifyHash } from 'utils/hash';
import { generateUserData } from 'tests/utils/generateData';
import { createStubHash } from '../../__mocks__/support/hash';

jest.mock('bcryptjs');

const stubExpiredHash = createStubHash();
const stubHash = createStubHash({ expiresAt: new Date('2022-05-25') });
const userData = generateUserData();

const mockFindFirst = jest.fn();

// const mockClient = client as jest.Mock;


const mockCompareSync = compareSync as jest.Mock;

describe('verifyHash', () => {
  beforeAll(() => {
    MockDate.set('2022-01-25');
  });
  prismaMock.user.update.mockResolvedValue(userData);

  beforeEach(() => {
    prismaMock.user.create.mockResolvedValue(userData);
    // mockClient.mockReturnValue({ hash: { findFirst: mockFindFirst } });
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
          userData.email,
          HashTypes.RESET_PASSWORD,
          userData.id,
        ),
      ).rejects.toThrowError(new ApiError(errors.INVALID_CODE));
    });

    it('code is not valid', () => {
      mockCompareSync.mockReturnValue(false);

      expect(
        verifyHash(
          '123456',
          userData.email,
          HashTypes.RESET_PASSWORD,
          userData.id,
        ),
      ).rejects.toThrowError(new ApiError(errors.INVALID_CODE));
    });

    it('code has expired', () => {
      expect(
        verifyHash(
          '123456',
          userData.email,
          HashTypes.RESET_PASSWORD,
          userData.id,
        ),
      ).rejects.toThrowError(new ApiError(errors.CODE_EXPIRED));
    });
//   });

//   it('success case', async () => {
//     mockFindFirst.mockResolvedValue(stubHash);

//     await expect(
//       verifyHash('123456', userData.email, HashTypes.RESET_PASSWORD),
//     ).resolves.toEqual(stubHash);

//     expect(mockFindFirst).toHaveBeenCalledWith({
//       where: {
//         sentTo: userData.email,
//         type: HashTypes.RESET_PASSWORD,
//         userId: undefined,
//       },
//     });
  });
});
