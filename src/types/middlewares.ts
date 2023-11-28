import { Request, Response, NextFunction } from 'express';

export type Wrapper = (
  fn: Function,
) => (req: Request, res: Response, next: NextFunction) => any;
