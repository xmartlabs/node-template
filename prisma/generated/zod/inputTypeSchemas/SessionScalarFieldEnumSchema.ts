import { z } from 'zod';

export const SessionScalarFieldEnumSchema = z.enum([
  'id',
  'createdAt',
  'updatedAt',
  'userId',
  'accessToken',
  'refreshToken',
]);

export default SessionScalarFieldEnumSchema;
