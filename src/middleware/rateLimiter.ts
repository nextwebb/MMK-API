/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { NextFunction, Request, Response } from 'express';

import redisClient from '../services/redisClient';

const WINDOW_DURATION_IN_HOURS = 24;
const MAX_WINDOW_REQUEST_COUNT = 50;

type smsPayload = {
  from: string;
  to: string;
  text: string;
};

export const customLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { from } = req.body as smsPayload;
  const data = {} as {
    requestCount: number;
  };

  const dataResponse = JSON.parse(String(await redisClient.get(from)));
  console.log(dataResponse);

  if (dataResponse['requestCount'] === MAX_WINDOW_REQUEST_COUNT) {
    res.status(400);
    res.json({ message: '', error: 'limit reached for from <from>' });
  } else {
    console.log('dataResponse');
    data['requestCount'] += 1;

    redisClient.set(from, JSON.stringify(data), {
      EX: 3600 * WINDOW_DURATION_IN_HOURS,
      NX: true,
    });
  }

  return next();
};
