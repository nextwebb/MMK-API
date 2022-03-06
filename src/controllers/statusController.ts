import {
  Request,
  Response,
  // NextFunction
} from 'express';

// GET /
export const getStatus = (
  req: Request,
  res: Response
  // next: NextFunction
): void => {
  res.status(200);
  res.json({ up: true, env: process.env.NODE_ENV });
};
