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
    it('can not find hash', () => {
      mockFindFirst.mockResolvedValue(null);

      expect(
        verifyCode(
          '123456',
          userData.id,
        ),
      ).rejects.toThrowError(new ApiError(errors.INVALID_CODE));
    });

    it('code is not valid', () => {
      mockCompare.mockReturnValue(false);

      expect(
        verifyCode(
          '123456',
          userData.id,
        ),
      ).rejects.toThrowError(new ApiError(errors.INVALID_CODE));
    });

    it('code has expired', () => {
      MockDate.set('2020-01-25');
      prismaMock.oTP.findFirst.mockResolvedValueOnce(stubHash);
      mockCompare.mockReturnValue(true);

      expect(
        verifyCode(
          '123456',
          userData.id,
        ),
      ).rejects.toThrowError(new ApiError(errors.CODE_EXPIRED));
    });
    //   });

    //   it('success case', async () => {
    //     mockFindFirst.mockResolvedValue(stubHash);

    //     await expect(
    //       verifyCode('123456', userData.email, HashTypes.RESET_PASSWORD),
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
