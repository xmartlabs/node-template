import express from 'express';
import { initializeFirebase } from 'config/firebase-config';
import { RegisterRoutes } from 'root/build/routes';
import { config } from 'config/config';
import { preRoutesMiddleware, postRoutesMiddleware } from 'middlewares';

import { routes } from 'routes';
import { appLogger } from 'config/logger';

const app = express();

preRoutesMiddleware(app);
// TSOA generated routes
RegisterRoutes(app);

app.use('/', routes);
postRoutesMiddleware(app);

// Initialize Firebase
initializeFirebase();

app.listen(config.port, () => {
  appLogger.info(`Server started at ${config.baseUrl}:${config.port}`);
});
