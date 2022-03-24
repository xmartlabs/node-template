import express from 'express';
import { applyMiddleware } from './middlewares';

import routes from './routes';

const app = express();
const port = 8080;

applyMiddleware(app);
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
