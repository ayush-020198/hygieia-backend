import { Response } from 'express';
import { Db } from 'mongodb';
import { DBUser, DBReport } from '../models';
import { APIResponse, AuthRequest } from '../interfaces';

type ReportResponse = APIResponse & {
  reports?: DBReport[];
};
export const reports = async (req: AuthRequest, res: Response<ReportResponse>, db: Db): Promise<void> => {
  try {
    const userCol = db.collection<DBUser>('users');
    const reportCol = db.collection<DBReport>('reports');

    const user = await userCol.findOne({ email: req.email });
    if (!user) throw 'User not found.';

    const reports = await reportCol.find({ userID: user._id }).toArray();
    res.json({ message: 'Extracted reports.', reports });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
    console.error(err);
  }
};
