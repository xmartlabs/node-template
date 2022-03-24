import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { User } from '../models';

export const index = (_req : Request, res : Response) => {
  res.send(User.all());
};

export const create = (req : Request, res : Response) => {
  res.send(User.create(req.body));
};

export const show = (req : Request, res : Response) => {
  const user = User.find(req.params.id);

  if (user) {
    res.send(user);
  } else {
    res.status(httpStatus.NOT_FOUND).send();
  }
};

export const update = (req : Request, res : Response) => {
  const updatedUser = User.update(req.params.id, req.body);

  if (updatedUser) {
    res.send(updatedUser);
  } else {
    res.status(httpStatus.NOT_FOUND).send();
  }
};

export const destroy = (req : Request, res : Response) => {
  const removedUser = User.destroy(req.params.id);

  if (removedUser) {
    res.send(removedUser);
  } else {
    res.status(httpStatus.NOT_FOUND).send();
  }
};
