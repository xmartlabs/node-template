import { faker } from '@faker-js/faker';

export const generateUserData = () => ({
  id: faker.datatype.uuid(),
  email: faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password(),
});
