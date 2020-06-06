import { Request, Response } from 'express';
import { Db } from 'mongodb';
import bcrypt from 'bcrypt';
import { DBUser } from '../models';
import { APIResponse } from '../interfaces';

interface LoginRequest {
  email: string;
  password: string;
}

type LoginResponse = APIResponse;
export const login = async (
  req: Request<null, LoginResponse, LoginRequest>,
  res: Response<LoginResponse>,
  db: Db
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const userCol = db.collection<DBUser>('users');

    const user = await userCol.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const match = await bcrypt.compare(password, user.hash);

    if (!match) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    res.json({ message: 'Login successful!' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
    console.error(err);
  }
};
