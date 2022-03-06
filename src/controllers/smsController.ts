import { Request, Response } from 'express';
// files
import prisma from '../services/prismaClient';
import redisClient from '../services/redisClient';

// POST /inbound
type smsPayload = {
  from: string;
  to: string;
  text: string;
};
export const inboundSms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { to, text, from } = req.body as smsPayload;
    const phoneNumber = await prisma.phone_number.findFirst({
      where: {
        number: to,
      },
    });

    if (!phoneNumber) {
      res.status(400);
      res.json({ message: '', error: 'to parameter not found' });
    }

    if (['STOP', 'STOP\n', 'STOP\r', 'STOP\r\n'].includes(text)) {
      await redisClient.SET(
        JSON.stringify(text),
        JSON.stringify({
          to,
          from,
        }),
        {
          EX: 3600 * 4,
          NX: true,
        }
      );
    }

    res.status(200);
    res.json({ message: 'inbound sms ok', error: '' });
  } catch (err) {
    res.status(500);
    res.json({ message: '', error: 'unknown failure' });
  } finally {
    await prisma.$disconnect();
  }
};

// POST /outbound
export const outboundSms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { to, text, from } = req.body as smsPayload;

    const result = JSON.parse(
      String(await redisClient.GET(JSON.stringify(text)))
    );

    // console.log(result);
    if (result && to === result['to'] && from === result['from']) {
      res.status(400);
      res.json({
        message: '',
        error: 'sms from <from> to <to> blocked by STOP request',
      });
    }

    res.status(200);
    res.json({ message: 'inbound sms ok', error: '' });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ message: '', error: 'unknown failure' });
  } finally {
    await prisma.$disconnect();
  }
  return;
};
