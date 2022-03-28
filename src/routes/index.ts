import { Router } from 'express';
import httpStatus from 'http-status';
import { ApiError } from '../utils/apiError';
import { usersRouter } from './users';

export const routes = Router();

routes.use('/users', usersRouter);
// Send back a 404 error for any unknown api request
// eslint-disable-next-line @typescript-eslint/no-unused-vars
routes.use('*', (req, res, next) => {
  throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
});
