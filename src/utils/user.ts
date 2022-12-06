import { ReturnUser } from 'types';
import { User } from '.prisma/client';

export const sendUserWithoutPassword = (user : User) : ReturnUser => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
