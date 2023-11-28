import { Request } from 'express';
import { ReturnUser } from 'types/user';

export type AuthenticatedRequest = Request & {
  user: ReturnUser & { token: string };
};
