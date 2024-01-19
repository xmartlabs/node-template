import { Router, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { errors } from 'config/errors';
import { ApiError } from 'utils/apiError';
import swaggerDocument from 'root/build/swagger.json';

export const routes = Router();

routes.get('/', (_req: Request, res: Response) =>
  res.send('<a href="/docs">See the API docs!</a>'),
);

routes.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Send back a 404 error for any unknown api request
// eslint-disable-next-line @typescript-eslint/no-unused-vars
routes.use('*', (req, res, next) => {
  throw new ApiError(errors.NOT_FOUND);
});
