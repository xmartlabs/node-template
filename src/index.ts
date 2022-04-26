import express from 'express';
import { RegisterRoutes } from '../build/routes';
import { config } from './config/config';
import { preRoutesMiddleware, postRoutesMiddleware } from './middlewares';

import { routes } from './routes';

const app = express();

preRoutesMiddleware(app);
// TSOA generated routes
RegisterRoutes(app);

app.use('/', routes);
postRoutesMiddleware(app);

app.listen(config.port, () => {
  console.log(`Server started at ${config.baseUrl}:${port}`);
});
