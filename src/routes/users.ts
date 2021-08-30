import { Router } from 'express';

import { Users } from '../controllers';

const usersRouter = Router();

usersRouter.route('/')
  .get(Users.index)
  .post(Users.create);

usersRouter.route('/:id')
  .get(Users.show)
  .put(Users.update)
  .delete(Users.destroy);

export { usersRouter };
