import httpStatus from 'http-status';
import {
  Body, Controller, Post, Route, Security,
} from 'tsoa';
import { SessionService } from 'services/session';
import { RequestResetPassword, RequestResetPasswordCode } from 'types/session';

@Route('sessions')
export class SessionsController extends Controller {
  @Post('/requestResetPasswordCode')
  @Security('jwt')
  public async sendResetPasswordEmail(
    @Body() body: RequestResetPasswordCode,
  ): Promise<void> {
    await SessionService.requestResetPasswordEmail(body.email);
    this.setStatus(httpStatus.OK);
  }

  @Post('/resetPassword')
  @Security('jwt')
  public async resetPassword(
    @Body() body: RequestResetPassword,
  ): Promise<void> {
    await SessionService.resetPassword(body.email, body.code, body.password);
    this.setStatus(httpStatus.OK);
  }
}
