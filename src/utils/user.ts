import { User } from '.prisma/client';
import { ReturnUser } from '../types';

export const sendUserWithoutPassword = (user : User) : ReturnUser => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
