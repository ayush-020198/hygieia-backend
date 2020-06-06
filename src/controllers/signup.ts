import { Request, Response } from 'express';
import { Db } from 'mongodb';
import { DBUser } from '../models';

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

interface SignupRespose {
  error?: string;
  message?: string;
}

export const signup = async (
  req: Request<null, SignupRespose, SignupRequest>,
  res: Response<SignupRespose>,
  db: Db
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const userCol = db.collection<DBUser>('users');

    const exists = await userCol.findOne({ email });
    if (exists) {
      res.status(400).json({ error: 'User already exists.' });
      return;
    }

    await userCol.insertOne({ name, email, hash: password });
    res.json({ message: 'Signup successful!' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
    console.error(err);
  }
};
