import { check } from 'express-validator';
export const signupValidator = [
  check('name').notEmpty().trim(),
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 }),
];
