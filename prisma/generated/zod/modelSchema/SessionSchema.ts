import { z } from 'zod';

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type Session = z.infer<typeof SessionSchema>;

export default SessionSchema;
