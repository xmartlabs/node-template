import { Request } from 'express';
import { ReturnUser } from './user';

export type AuthenticatedRequest = Request & { user: ReturnUser };
