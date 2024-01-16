import { faker } from '@faker-js/faker';
import { Session, User, Tokens, TypeToken } from '@prisma/client';
import { endOfTomorrow } from 'date-fns';

export const generateUserData = (opts?: Partial<User>) => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
  ...opts,
});

export const generateTokenData = (opts?: Partial<Tokens>) => ({
  id: faker.string.uuid(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
  expiresAt: endOfTomorrow(),
  type: TypeToken.RESET_PASSWORD,
  userId: faker.string.uuid(),
  token: faker.string.alphanumeric(),
  ...opts,
});

export const generateSessionData = (opts?: Partial<Session>) => ({
  id: faker.string.uuid(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
  accessToken: faker.string.alphanumeric(50),
  refreshToken: faker.string.alphanumeric(50),
  userId: faker.string.uuid(),
  ...opts,
});
