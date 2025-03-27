import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum([
  'id',
  'createdAt',
  'updatedAt',
  'email',
  'password',
  'name',
]);

export default UserScalarFieldEnumSchema;
