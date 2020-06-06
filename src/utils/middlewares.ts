import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

export const withValidator: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: 'Request valiation failed.', errors });
    return;
  }
  next();
};
