/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response, NextFunction } from 'express';

import { IError } from '../types';
import prisma from '../services/prismaClient';
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function authentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authheader = req.headers.authorization;

  if (!authheader) {
    const err: IError = new Error('You are not authenticated!');

    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 403;
    return next(err);
  }

  const auth = Buffer.from(authheader.split(' ')[1], 'base64')
    .toString()
    .split(':');
  const username = auth[0];
  const password = auth[1];

  const account = await prisma.account.findMany({
    where: {
      username,
      auth_id: password,
    },
  });

  //   console.log(account);

  if (account) {
    res.locals.account = account;
    // If Authorized user
    return next();
  } else {
    const err: IError = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 403;
    return next(err);
  }
}

export const validator =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const validationValue = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
      convert: false,
      skipFunctions: true,
    });
    if (validationValue.error) {
      const errorMessages = validationValue.error.details.map(
        (error: { message: any }) => error.message
      );

      return res.status(422).json({ error: errorMessages });
    }

    return next();
  };
