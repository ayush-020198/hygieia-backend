import { Response } from 'express';
import { Db } from 'mongodb';
import { DBUser } from '../models';
import { APIResponse, AuthRequest } from '../interfaces';

type ReportResponse = APIResponse & {
  user?: DBUser;
};
export const user = async (req: AuthRequest, res: Response<ReportResponse>, db: Db): Promise<void> => {
  try {
    const userCol = db.collection<DBUser>('users');

    const user = await userCol.findOne({ email: req.email });
    if (!user) throw 'User not found.';

    res.json({ message: 'Extracted user details', user });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
    console.error(err);
  }
};
