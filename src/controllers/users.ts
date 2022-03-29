import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { wrapper } from '../middlewares';
import { UserService } from '../services';

export const UsersController = {
  index: wrapper(async (req : Request, res : Response) => {
    const users = await UserService.all();
    res.status(httpStatus.OK).send(users);
  }),

  create: wrapper(async (req : Request, res : Response) => {
    const user = await UserService.create(req.body);
    res.status(httpStatus.CREATED).send(user);
  }),

  find: wrapper(async (req : Request, res : Response) => {
    const user = await UserService.find(req.params.id);
    res.status(httpStatus.OK).send(user);
  }),

  update: wrapper(async (req : Request, res : Response) => {
    const user = await UserService.update(req.params.id, req.body);
    res.status(httpStatus.OK).send(user);
  }),

  destroy: wrapper(async (req : Request, res : Response) => {
    await UserService.destroy(req.params.id);
    res.status(httpStatus.NO_CONTENT).send();
  }),
};
