import httpStatus from 'http-status';
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Request,
  Route,
  Security,
} from 'tsoa';
import { UserService } from 'services';
import {
  ReturnUser,
  UpdateUserParams,
  AuthenticatedRequest,
  PasswordResetCodeRequest,
  ResetPassword,
} from 'types';
import { cookieEnabled } from 'config/config';
import { COOKIE_NAME } from 'utils/auth';

@Route('v1/users')
export class UsersControllerV1 extends Controller {
  @Get()
  @Security('jwt')
  @Security('cookie')
  public async index(): Promise<ReturnUser[]> {
    const users = await UserService.all();
    this.setStatus(httpStatus.OK);
    return users;
  }

  @Get('/me')
  @Security('jwt')
  @Security('cookie')
  public async getMe(
    @Request() req: AuthenticatedRequest,
  ): Promise<ReturnUser | null> {
    const user = await UserService.find(req.user.id);
    this.setStatus(httpStatus.OK);
    return user;
  }

  @Get('{id}')
  @Security('jwt')
  @Security('cookie')
  public async find(@Path() id: string): Promise<ReturnUser | null> {
    const user = await UserService.find(id);
    this.setStatus(httpStatus.OK);
    return user;
  }

  @Put('{id}')
  @Security('jwt')
  @Security('cookie')
  public async update(
    @Path() id: string,
    @Body() requestBody: UpdateUserParams,
  ): Promise<ReturnUser> {
    const user = await UserService.update(id, requestBody);
    this.setStatus(httpStatus.OK);
    return user;
  }

  @Delete('{id}')
  @Security('jwt')
  @Security('cookie')
  public async destroy(
    @Path() id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    const { user, res } = req;
    await UserService.destroy(id);
    if (cookieEnabled && user.id === id) res?.clearCookie(COOKIE_NAME);
    this.setStatus(httpStatus.NO_CONTENT);
  }

  @Post('/requestResetPasswordCode')
  public async requestResetPasswordCode(
    @Body() requestBody: PasswordResetCodeRequest,
  ): Promise<void> {
    await UserService.requestResetPasswordCode(requestBody.email);
    this.setStatus(httpStatus.OK);
  }

  @Post('/resetPassword')
  public async resetPassword(
    @Body() requestBody: ResetPassword,
  ): Promise<void> {
    const { email, code, newPassword } = requestBody;
    await UserService.resetPassword(email, code, newPassword);
    this.setStatus(httpStatus.OK);
  }
}
