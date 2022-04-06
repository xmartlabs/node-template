import { User } from '@prisma/client';

export type ReturnUser = Omit<User, 'password'>;

export type CreateUserParams = Omit<User, 'id'>;
