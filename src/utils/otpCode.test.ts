import { errors } from 'config/errors';
import { prismaMock } from 'tests/prismaSetup';
import { ApiError } from 'utils/apiError';
import { verifyCode, generateOTPCode } from 'utils/otpCode';
import * as securityService from 'services/security';
import { generateUserData, generateOTPCodeData, generateOTPExpiredCodeData } from 'tests/utils/generateData';

jest.spyOn(securityService, 'generateCode').mockImplementation(() => '123456');

const OTPExpiredCodeData = generateOTPExpiredCodeData();
const OTPCodeData = generateOTPCodeData();
const userData = generateUserData();

describe('verifyCode', () => {
  describe('error cases', () => {
    it('can not find user', () => {
      prismaMock.otpCode.findFirst.mockResolvedValue(null);
      expect(
        verifyCode(
          '123456',
          userData.id,
        ),
      ).rejects.toThrowError(new ApiError(errors.INVALID_VERIFICATION_CODE));
    });
    it('expired code', () => {
      prismaMock.otpCode.findFirst.mockResolvedValue(OTPExpiredCodeData);
      expect(
        verifyCode(
          '123456',
          userData.id,
        ),
      ).rejects.toThrowError(new ApiError(errors.CODE_EXPIRED));
    });
    it('expired code', () => {
      prismaMock.otpCode.findFirst.mockResolvedValue(OTPCodeData);
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
      prismaMock.otpCode.findFirst.mockResolvedValue({ ...OTPCodeData, code: '123456' });
      expect(verifyCode(
        '123456',
        userData.id,
      )).resolves.toEqual(true);
    });
  });
});

describe('generateCode', () => {
  describe('error cases', () => {
    it('Unvalidated code already exists', () => {
      prismaMock.otpCode.findFirst.mockResolvedValue(OTPCodeData);
      expect(
        generateOTPCode(
          userData.id,
        ),
      ).rejects.toThrowError(new ApiError(errors.UNVALIDATED_CODE_ALREADY_EXISTS));
    });
  });
  describe('generate code successfully', () => {
    it('generate code successfully', async () => {
      prismaMock.otpCode.findFirst.mockResolvedValue(null);
      prismaMock.otpCode.upsert.mockResolvedValue({ ...OTPCodeData, code: '123456' });

      const code = await generateOTPCode(userData.id);
      expect(code).toEqual('123456');
    });
  });
});
