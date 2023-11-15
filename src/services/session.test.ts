import { errors } from 'config/errors';
import { ApiError } from 'utils/apiError';
import { generateOTPCode } from 'utils/otpCode';
import * as securityService from 'services/security';
import { SessionService } from 'services/session';

import { generateUserData, generateOTPCodeData } from 'tests/utils/generateData';
import { sendEmail } from 'emails';
import { config } from 'config/config';
import { UserService } from './user';

jest.spyOn(securityService, 'generateCode').mockImplementation(() => '123456');

const OTPCodeData = generateOTPCodeData();
const userData = generateUserData();

jest.mock('emails/index');
jest.mock('utils/otpCode');

const mockGenerateOTPCode = generateOTPCode as jest.Mock;
const mockSendEmail = sendEmail as jest.Mock;

describe('Request Reset Password Email', () => {
  describe('error cases', () => {
    it('Invalid email', async () => {
      await expect(SessionService.requestResetPasswordEmail('mail23'))
        .rejects.toThrow(new ApiError(errors.INVALID_EMAIL));
    });

    it('User not found', async () => {
      await expect(SessionService.requestResetPasswordEmail('mail12345@gmail.com'))
        .rejects.toThrow(new ApiError(errors.USER_NOT_FOUND));
    });
  });

  describe('success cases', () => {
    beforeEach(() => {
      UserService.findByEmail = jest.fn().mockResolvedValue(userData);
      mockGenerateOTPCode.mockResolvedValue(OTPCodeData.code);
      mockSendEmail.mockResolvedValue(undefined);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should send reset password email for valid email and existing user', async () => {
      const { email } = userData;

      await expect(SessionService.requestResetPasswordEmail(email)).resolves.not.toThrow();

      expect(UserService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockGenerateOTPCode).toHaveBeenCalledWith(userData.id);
      expect(sendEmail).toHaveBeenCalledWith(
        email,
        `${config.appName} one time use code`,
        OTPCodeData.code,
        '',
      );
    });
  });
});
