import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../prisma/client';
import { ApiError } from '../utils/apiError';
import { ReturnUser } from '../types';
import { sendUserWithoutPassword } from '../utils/user';

export class UserService {
  static find = async (id : string) : Promise<User | null> => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
  };

  static all = async () : Promise<User[]> => {
    const users = await prisma.user.findMany();
    return users;
  };

  static create = async (userBody : User) : Promise<ReturnUser> => {
    const { name, email, password } = userBody;

    let user: User | null;

    // Required fields
    if (!(email && password)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Must provide all the required fields');
    }

    // Check if email is valid (from email-validator library)
    if (!/^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/.test(email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email');
    }

    // Check if the email is taken
    user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      throw new ApiError(httpStatus.CONFLICT, 'A user with that email already exists');
    }

    // Data transformation before calling the prisma service
    const cryptPassword = await bcrypt.hash(userBody.password, 8);

    const data = {
      name,
      email,
      password: cryptPassword,
    };

    user = await prisma.user.create({ data });

    return sendUserWithoutPassword(user);
  };

  static update = async (id : string, userData : User) : Promise<ReturnUser> => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: userData,
    });
    return sendUserWithoutPassword(updatedUser);
  };

  static destroy = async (id : string) : Promise<void> => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    await prisma.user.delete({ where: { id } });
  };
}
