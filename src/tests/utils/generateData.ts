import { faker } from '@faker-js/faker';

export const generateUserData = () => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});
