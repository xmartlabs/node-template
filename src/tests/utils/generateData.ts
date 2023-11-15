import { faker } from '@faker-js/faker';

export const generateUserData = () => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const generateOTPCodeData = () => ({
  id: faker.string.uuid(),
  code: faker.string.numeric(6),
  userId: faker.string.uuid(),
  expiresAt: faker.date.future(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const generateOTPExpiredCodeData = () => ({
  id: faker.string.uuid(),
  code: faker.string.numeric(6),
  userId: faker.string.uuid(),
  expiresAt: faker.date.past(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});
