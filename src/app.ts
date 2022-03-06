import express, { NextFunction } from 'express';
import { Application } from 'express';
import { Request, Response } from 'express';
import createError from 'http-errors';
import { Err } from 'joi';

// express app
const app: Application = express();

// files
import router from './router';
import redisClient from './services/redisClient';
redisClient.connect();

// routes
app.use('/api/', router);
app.use((req, res, next) => {
  next(createError(405));
});

app.use(
  (
    err: Err & { message: string; status: number },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 400);
    res.json({ error: err.message, message: 'Operation failed' });
    next();
  }
);

export default app;
