import httpStatus from 'http-status';
import { Body, Controller, Post, Request, Route, Security } from 'tsoa';

import { AuthService } from 'services/auth';
import {
  CreateUserParams,
  ReturnAuth,
  RefreshTokenParams,
  AuthenticatedRequest,
  LoginParams,
} from 'types';
import { COOKIE_NAME, cookieConfig } from 'utils/auth';

@Route('v1/auth')
export class AuthControllerV1 extends Controller {
  @Post('/register')
  public async register(
    @Body() user: CreateUserParams,
    @Request() req: AuthenticatedRequest,
  ): Promise<ReturnAuth | null> {
    const { sessionId, ...authReturn } = await AuthService.register(user);

    const { res } = req;
    res?.cookie(COOKIE_NAME, sessionId, cookieConfig);

    this.setStatus(httpStatus.CREATED);
    return authReturn;
  }

  @Post('/login')
  public async login(
    @Body() loginParams: LoginParams,
    @Request() req: AuthenticatedRequest,
  ): Promise<ReturnAuth | null> {
    const { sessionId, ...authReturn } = await AuthService.login(loginParams);
    const { res } = req;
    res?.cookie(COOKIE_NAME, sessionId, cookieConfig);
    this.setStatus(httpStatus.OK);
    return authReturn;
  }

  @Post('/logout')
  @Security('cookie')
  @Security('jwt')
  public async logout(@Request() req: AuthenticatedRequest): Promise<void> {
    await AuthService.logout(req.user.token);
    const { res } = req;
    res?.clearCookie(COOKIE_NAME);
    this.setStatus(httpStatus.OK);
  }

  @Post('/refresh')
  public async refresh(
    @Body() refreshToken: RefreshTokenParams,
  ): Promise<ReturnAuth> {
    const authReturn = await AuthService.refresh(refreshToken);
    this.setStatus(httpStatus.OK);
    return authReturn;
  }
}
