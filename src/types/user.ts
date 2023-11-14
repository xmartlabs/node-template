import { User } from '@prisma/client';

export type ReturnUser = Omit<User, 'password'>;

export type CreateUserParams = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateUserParams = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
