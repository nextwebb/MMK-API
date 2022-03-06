import express from 'express';
import cors from 'cors';
// import morgan from 'morgan';
import helmet from 'helmet';
// files
import httpLogger from './utils/morganLogger';
import { getStatus } from './controllers/statusController';
import { inboundSms, outboundSms } from './controllers/smsController';
import { authentication, validator } from './middleware';
import { inBoundSmsSchema, outBoundSmsSchema } from './middleware/joi';
import { customLimiter } from './middleware/rateLimiter';

// express router
const router = express.Router();

// middlewares
router.use(httpLogger);
router.use(helmet()); // security
router.use(cors());
router.use(express.json()); // request application/type === json
router.use(express.urlencoded({ extended: false })); // form data object, value objectnya berasal dari input attribute name
// router.use(compression()); // Gzip compressing can greatly decrease the size of the response body

// routes
router.get('/', getStatus); // test if app is working!
router.post(
  '/inbound/sms',
  authentication,
  validator(inBoundSmsSchema),
  inboundSms
);
router.post(
  '/outbound/sms',
  authentication,
  validator(outBoundSmsSchema),
  customLimiter,
  outboundSms
);

export default router;
