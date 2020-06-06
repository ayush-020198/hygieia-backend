import jwt from 'jsonwebtoken';
import { JWTPayload } from '../interfaces';
import config from '../config';

export const genToken = (payload: JWTPayload): [string, string] => {
  const token = jwt.sign(payload, config.jwt.secret, {
    algorithm: 'HS512',
    subject: 'login',
    expiresIn: config.jwt.expiry,
  });

  return [token, config.jwt.expiry];
};
