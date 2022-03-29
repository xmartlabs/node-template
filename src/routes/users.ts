import { Router } from 'express';

import { UsersController } from '../controllers';

const usersRouter = Router();

usersRouter.route('/')
  .get(UsersController.index)
  .post(UsersController.create);

usersRouter.route('/:id')
  .get(UsersController.find)
  .put(UsersController.update)
  .delete(UsersController.destroy);

export { usersRouter };
