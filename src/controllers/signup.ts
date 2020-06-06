import { Request, Response } from 'express';
import { Db } from 'mongodb';
import bcrypt from 'bcrypt';
import { DBUser } from '../models';
import { validationResult, Result, ValidationError } from 'express-validator';

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

interface SignupRespose {
  error?: string;
  errors?: Result<ValidationError>;
  message?: string;
}

export const signup = async (
  req: Request<null, SignupRespose, SignupRequest>,
  res: Response<SignupRespose>,
  db: Db
): Promise<void> => {
  try {
    const errors = validationResult(req);

    const { name, email, password } = req.body;
    if (!errors.isEmpty()) {
      res.status(400).json({ error: 'Request valiation failed.', errors });
      return;
    }

    const userCol = db.collection<DBUser>('users');

    const exists = await userCol.findOne({ email });
    if (exists) {
      res.status(400).json({ error: 'User already exists.' });
      return;
    }

    const hash = await bcrypt.hash(password, 10);

    await userCol.insertOne({ name, email, hash });
    res.json({ message: 'Signup successful!' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
    console.error(err);
  }
};
