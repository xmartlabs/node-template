export { User as DatabaseUser } from '@prisma/client';

type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  password: string;
  name: string | null;
};

export type ReturnUser = Omit<User, 'password'>;

export type CreateUserParams = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateUserParams = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
