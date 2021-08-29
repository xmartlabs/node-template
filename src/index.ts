import express, { Request, Response } from 'express';

const app = express();
const port = 8080;

app.get('/', (req : Request, res : Response) => {
  res.send('Hola mundo!');
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
