import httpStatus from 'http-status';
import {
  Body,
  Controller,
  Post,
  Request,
  Route,
  Security,
} from 'tsoa';
import { AuthService } from 'services/auth';
import { CreateUserParams, ReturnAuth, RefreshTokenParams } from 'types';
import { LoginParams } from 'types/auth';
import { AuthenticatedRequest } from 'types/request';

@Route('auth')
export class AuthController extends Controller {
  @Post('/register')
  public async register(@Body() user: CreateUserParams): Promise<ReturnAuth> {
    const authReturn = await AuthService.register(user);
    this.setStatus(httpStatus.CREATED);
    return authReturn;
  }

  @Post('/login')
  public async login(@Body() loginParams: LoginParams): Promise<ReturnAuth> {
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
  public async refresh(@Body() refreshToken: RefreshTokenParams): Promise<ReturnAuth> {
    const authReturn = await AuthService.refresh(refreshToken);
    this.setStatus(httpStatus.OK);
    return authReturn;
  }
}
