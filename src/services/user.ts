import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import prisma from '../../prisma/client';
import { ApiError } from '../utils/apiError';
import { ReturnUser, CreateUserParams } from '../types';
import { sendUserWithoutPassword } from '../utils/user';
import { emailRegex } from '../utils/constants';
import { errors } from '../config/errors';

export class UserService {
  static find = async (id : string) : Promise<ReturnUser | null> => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(errors.notFoundUser);
    }
    return sendUserWithoutPassword(user);
  };

  static all = () : Promise<User[]> => (prisma.user.findMany());

  static create = async (userBody : CreateUserParams) : Promise<ReturnUser> => {
    const { name, email, password } = userBody;

    let user: User | null = null;

    // Check if email is valid (from email-validator library)
    if (!emailRegex.test(email)) {
      throw new ApiError(errors.invalidEmail);
    }

    // Data transformation before calling the prisma service
    const cryptPassword = await bcrypt.hash(password, 8);

    const data = {
      name,
      email,
      password: cryptPassword,
    };

    try {
      user = await prisma.user.create({ data });
    } catch (e) {
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ApiError(errors.userAlreadyExists);
      }
    }
    if (!user) {
      throw new ApiError(errors.userCreationFailed);
    }
    return sendUserWithoutPassword(user);
  };

  static update = async (id : string, userData : User) : Promise<ReturnUser> => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new ApiError(errors.notFoundUser);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...userData,
        password: user.password,
      },
    });
    return sendUserWithoutPassword(updatedUser);
  };

  static destroy = async (id : string) : Promise<void> => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new ApiError(errors.notFoundUser);
    }

    await prisma.user.delete({ where: { id } });
  };
}