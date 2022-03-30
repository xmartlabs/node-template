import { Router, Request, Response } from 'express';
import httpStatus from 'http-status';
import swaggerUi from 'swagger-ui-express';
import { ApiError } from '../utils/apiError';

export const routes = Router();

routes.get('/', (_req: Request, res: Response) => res.send('<a href="docs">/docs</a>'));

routes.use('/docs', swaggerUi.serve, async (_req: Request, res: Response) => res.send(
  swaggerUi.generateHTML(await import('../../build/swagger.json')),
));

// Send back a 404 error for any unknown api request
// eslint-disable-next-line @typescript-eslint/no-unused-vars
routes.use('*', (req, res, next) => {
  throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
});
