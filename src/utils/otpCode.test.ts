import { errors } from 'config/errors';
import { prismaMock } from 'tests/prismaSetup';
import { ApiError } from 'utils/apiError';
import { verifyCode } from 'utils/otpCode';
import { generateUserData, generateOTPCodeData, generateOTPExpiredCodeData } from 'tests/utils/generateData';

jest.mock('bcryptjs');

const OTPExpiredCodeData = generateOTPExpiredCodeData();
const OTPCodeData = generateOTPCodeData();

const userData = generateUserData();

describe('verifyCode', () => {
  describe('error cases', () => {
    it('can not find user', () => {
      prismaMock.oTP.findFirst.mockResolvedValue(null);
      expect(
        verifyCode(
          '123456',
          userData.id,
        ),
      ).rejects.toThrowError(new ApiError(errors.INVALID_USER));
    });
    it('expired code', () => {
      prismaMock.oTP.findFirst.mockResolvedValue(OTPExpiredCodeData);
      expect(
        verifyCode(
          '123456',
          userData.id,
        ),
      ).rejects.toThrowError(new ApiError(errors.CODE_EXPIRED));
    });
    it('expired code', () => {
      prismaMock.oTP.findFirst.mockResolvedValue(OTPCodeData);
      expect(
        verifyCode(
          '123456',
          userData.id,
        ),
      ).rejects.toThrowError(new ApiError(errors.INVALID_CODE));
    });
  });
  describe('Verify code successfully', () => {
    it('Verify code successfully', () => {
      prismaMock.oTP.findFirst.mockResolvedValue({ ...OTPCodeData, code: '123456' });
      expect(verifyCode(
        '123456',
        userData.id,
      )).resolves.toEqual(true);
    });
  });
});
