import { User } from '@prisma/client';
import httpStatus from 'http-status';
import {
  Body,
  Controller, Delete, Get, Path, Post, Put, Route,
} from 'tsoa';
import { UserService } from '../services';
import { CreateUserParams, ReturnUser } from '../types/user';

@Route('users')
export class UsersController extends Controller {
  @Get()
  public async index(): Promise<ReturnUser[]> {
    const users = await UserService.all();
    this.setStatus(httpStatus.OK);
    return users;
  }

  @Post()
  public async create(@Body() requestBody : CreateUserParams): Promise<ReturnUser> {
    const user = await UserService.create(requestBody);
    this.setStatus(httpStatus.CREATED);
    return user;
  }

  @Get('{id}')
  public async find(@Path() id : string): Promise<ReturnUser | null> {
    const user = await UserService.find(id);
    this.setStatus(httpStatus.OK);
    return user;
  }

  @Put('{id}')
  public async update(@Path() id : string, @Body() requestBody : User): Promise<ReturnUser> {
    const user = await UserService.update(id, requestBody);
    this.setStatus(httpStatus.OK);
    return user;
  }

  @Delete('{id}')
  public async destroy(@Path() id : string): Promise<void> {
    await UserService.destroy(id);
    this.setStatus(httpStatus.NO_CONTENT);
  }
}
