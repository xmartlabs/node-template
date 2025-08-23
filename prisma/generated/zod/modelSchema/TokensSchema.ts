import { z } from 'zod';
import { TypeTokenSchema } from '../inputTypeSchemas/TypeTokenSchema';

/////////////////////////////////////////
// TOKENS SCHEMA
/////////////////////////////////////////

export const TokensSchema = z.object({
  type: TypeTokenSchema,
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  token: z.string(),
  expiresAt: z.coerce.date(),
  userId: z.string().nullable(),
});

export type Tokens = z.infer<typeof TokensSchema>;

export default TokensSchema;
