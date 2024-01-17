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
import { validateLoginSchema, validateUserSchema } from 'data-schemas/auth';

@Route('v1/auth')
export class AuthControllerV1 extends Controller {
  @Post('/register')
  public async register(@Body() user: CreateUserParams): Promise<ReturnAuth> {
    validateUserSchema(user);

    const authReturn = await AuthService.register(user);
    this.setStatus(httpStatus.CREATED);
    return authReturn;
  }

  @Post('/login')
  public async login(@Body() loginParams: LoginParams): Promise<ReturnAuth> {
    validateLoginSchema(loginParams);

    const authReturn = await AuthService.login(loginParams);
    this.setStatus(httpStatus.OK);
    return authReturn;
  }

  @Post('/logout')
  @Security('jwt')
  public async logout(@Request() req: AuthenticatedRequest): Promise<void> {
    await AuthService.logout(req.user.token);
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
