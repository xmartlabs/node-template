import { faker } from '@faker-js/faker';

import { TypeHash, User, Hash } from '@prisma/client';
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

export const generateHashData = (opts?: Partial<Hash>) => ({
  id: faker.string.uuid(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
  expiresAt: endOfTomorrow(),
  type: TypeHash.RESET_PASSWORD,
  userId: faker.string.uuid(),
  hash: faker.string.alphanumeric(),
  ...opts,
});
