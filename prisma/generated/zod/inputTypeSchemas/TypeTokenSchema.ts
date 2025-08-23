import { z } from 'zod';

export const TypeTokenSchema = z.enum(['RESET_PASSWORD']);

export type TypeTokenType = `${z.infer<typeof TypeTokenSchema>}`;

export default TypeTokenSchema;
