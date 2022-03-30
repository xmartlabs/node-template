import express from 'express';
import { RegisterRoutes } from '../build/routes';
import { config } from './config/config';
import { preRoutesMiddleware, postRoutesMiddleware } from './middlewares';

import { routes } from './routes';

const app = express();
const port = 8080;

preRoutesMiddleware(app);
// TSOA generated routes
RegisterRoutes(app);

app.use('/', routes);
postRoutesMiddleware(app);

app.listen(port, () => {
  console.log(`Server started at ${config.baseUrl}:${port}`);
});
