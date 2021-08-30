import express from 'express';
import morgan from 'morgan';

import { usersRouter } from './routes';

const app = express();
const port = 8080;

app.use(morgan('dev'));
app.use(express.json());

app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
