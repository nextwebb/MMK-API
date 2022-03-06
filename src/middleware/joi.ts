import Joi from 'Joi';

export const inBoundSmsSchema = Joi.object().keys({
  from: Joi.string().min(6).max(16).required(),
  to: Joi.string().min(6).max(16).required(),
  text: Joi.string().min(1).max(120).required(),
});

export const outBoundSmsSchema = Joi.object().keys({
  from: Joi.string().min(6).max(16).required(),
  to: Joi.string().min(6).max(16).required(),
  text: Joi.string().min(1).max(120).required(),
});
