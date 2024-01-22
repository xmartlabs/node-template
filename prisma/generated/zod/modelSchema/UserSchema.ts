import { z } from 'zod';

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  email: z.string(),
  password: z.string(),
  name: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;

export default UserSchema;
