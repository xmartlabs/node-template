import { z } from 'zod';

export const TokensScalarFieldEnumSchema = z.enum([
  'id',
  'createdAt',
  'updatedAt',
  'token',
  'type',
  'expiresAt',
  'userId',
]);

export default TokensScalarFieldEnumSchema;
