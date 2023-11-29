import httpStatus from 'http-status';
import {
  Body,
  Controller,
  Post,
  Route,
} from 'tsoa';
import { PasswordResetCodeRequest, ResetPassword } from 'types';
import { SessionService } from 'services/session';

@Route('v1/session')
export class SessionControllerV1 extends Controller {
  @Post('/requestResetPasswordCode')
  public async requestResetPasswordCode(
    @Body() requestBody: PasswordResetCodeRequest,
  ): Promise<void> {
    await SessionService.requestResetPasswordCode(requestBody.email);
    this.setStatus(httpStatus.OK);
  }

  @Post('/resetPassword')
  public async resetPassword(
    @Body() requestBody: ResetPassword,
  ): Promise<void> {
    const {email, code, newPassword} = requestBody;
    await SessionService.resetPassword(email, code, newPassword);
    this.setStatus(httpStatus.OK);
  }
}
