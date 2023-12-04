import { ReturnUser, DatabaseUser } from 'types';

export const sendUserWithoutPassword = (user: DatabaseUser): ReturnUser => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
