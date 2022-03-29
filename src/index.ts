import express from 'express';
import config from './config/config';
import { applyMiddleware } from './middlewares';

import routes from './routes';

const app = express();
const port = 8080;

applyMiddleware(app);
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server started at ${config.baseUrl}:${port}`);
});
