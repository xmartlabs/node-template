import httpStatus from 'http-status';
import {
  Body,
  Controller, Delete, Get, Path, Put, Request, Route, Security,
} from 'tsoa';
import { User } from '@prisma/client';
import { UserService } from 'services';
import { AuthenticatedRequest } from 'types/request';
import { ReturnUser } from 'types';

@Route('users')
export class UsersController extends Controller {
  @Get()
  @Security('jwt')
  public async index(): Promise<ReturnUser[]> {
    const users = await UserService.all();
    this.setStatus(httpStatus.OK);
    return users;
  }

  @Get('/me')
  @Security('jwt')
  public async getMe(@Request() req : AuthenticatedRequest): Promise<ReturnUser | null> {
    const user = await UserService.find(req.user.id);
    this.setStatus(httpStatus.OK);
    return user;
  }

  @Get('{id}')
  @Security('jwt')
  public async find(@Path() id : string): Promise<ReturnUser | null> {
    const user = await UserService.find(id);
    this.setStatus(httpStatus.OK);
    return user;
  }

  @Put('{id}')
  @Security('jwt')
  public async update(@Path() id : string, @Body() requestBody : User): Promise<ReturnUser> {
    const user = await UserService.update(id, requestBody);
    this.setStatus(httpStatus.OK);
    return user;
  }

  @Delete('{id}')
  @Security('jwt')
  public async destroy(@Path() id : string): Promise<void> {
    await UserService.destroy(id);
    this.setStatus(httpStatus.NO_CONTENT);
  }
}
