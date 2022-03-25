import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { User } from '../models';
import ApiError from '../utils/apiError';

export const index = (_req : Request, res : Response) => {
  res.send(User.all());
};

export const create = (req : Request, res : Response) => {
  res.send(User.create(req.body));
};

export const show = (req : Request, res : Response) => {
  const user = User.find(req.params.id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
};

export const update = (req : Request, res : Response) => {
  const updatedUser = User.update(req.params.id, req.body);

  if (!updatedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(updatedUser);
};

export const destroy = (req : Request, res : Response) => {
  const removedUser = User.destroy(req.params.id);

  if (!removedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(removedUser);
};
