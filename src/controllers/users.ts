import { Request, Response } from 'express';

import { DatabaseError } from '../errors';

import { User } from '../models';

export const index = async (_req : Request, res : Response) => {
  try {
    const allUsers = await User.all();
    res.send(allUsers);
  } catch (e) {
    if (e instanceof DatabaseError) {
      console.log(e.details);
    }
  }
};

export const create = async (req : Request, res : Response) => {
  try {
    res.send(await User.create(req.body));
  } catch (e) {
    if (e instanceof DatabaseError) {
      console.log(e.details);
    }
  }
};

export const show = async (req : Request, res : Response) => {
  try {
    const userId = Number(req.params.id);
    if (Number.isNaN(userId)) {
      // TODO: build proper error
    }

    const user = await User.find(userId);

    if (user) {
      res.send(user);
    } else {
      res.status(404).send();
    }
  } catch (e) {
    if (e instanceof DatabaseError) {
      console.log(e.details);
    }
  }
};

export const update = (req : Request, res : Response) => {
  const updatedUser = User.update(req.params.id, req.body);

  if (updatedUser) {
    res.send(updatedUser);
  } else {
    res.status(404).send();
  }
};

export const destroy = (req : Request, res : Response) => {
  const removedUser = User.destroy(req.params.id);

  if (removedUser) {
    res.send(removedUser);
  } else {
    res.status(404).send();
  }
};
