import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { JWTPayload, AuthRequest } from '../interfaces';
import config from '../config';

export const withValidator: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: 'Request valiation failed.', errors });
    return;
  }
  next();
};

export const withAuth: RequestHandler = (req: AuthRequest, res, next) => {
  const token = req.cookies['token'] || '';
  try {
    const decoded = jwt.verify(token, config.jwt.secret, {
      algorithms: ['HS512'],
      subject: 'login',
    });

    req.email = (decoded as JWTPayload).email;

    next();
  } catch (error) {
    res.status(403).json({ error: 'Authentication required.' });
  }
};
