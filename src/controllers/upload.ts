import { Response } from 'express';
import { Db, MongoClient, TransactionOptions } from 'mongodb';
import * as openpgp from 'openpgp';
import IpfsHttpClient from 'ipfs-http-client';
import { DBUser, DBReport } from '../models';
import { APIResponse, AuthRequest } from '../interfaces';

const ipfs = IpfsHttpClient('http://localhost:5001');

type UploadResponse = APIResponse & {
  cid?: string;
};
export const upload = async (
  req: AuthRequest,
  res: Response<UploadResponse>,
  db: Db,
  client: MongoClient
): Promise<void> => {
  try {
    const userCol = db.collection<DBUser>('users');
    const reportCol = db.collection<DBReport>('reports');

    const user = await userCol.findOne({ email: req.email });

    const { data: encrypted } = await openpgp.encrypt({
      message: openpgp.message.fromBinary(new Uint8Array(req.file.buffer)),
      publicKeys: (await openpgp.key.readArmored(user.keys.pubKey)).keys,
    });

    let report: {
      path: string;
    };

    for await (report of ipfs.add(new Buffer(encrypted))) {
      console.log(`[upload] uploaded ${report.path} to IPFS`);
    }

    const session = client.startSession();

    const trxOptions: TransactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'majority' },
      writeConcern: { w: 'majority' },
    };

    try {
      await session.withTransaction(async () => {
        const reportRes = await reportCol.insertOne(
          {
            cid: report.path,
            userID: user._id,
            title: req.body.title,
            name: req.file.originalname,
            mime: req.file.mimetype,
          },
          { session }
        );

        const userRes = userCol.updateOne({ _id: user._id }, { $push: { reports: reportRes.insertedId } }, { session });

        return userRes;
      }, trxOptions);
    } catch (err) {
      console.error('trx failed', err);
      res.status(500).json({ error: 'Something went wrong. Please try again.' });
    } finally {
      session.endSession();
    }

    res.json({ message: 'upload successful!', cid: report.path });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
    console.error(err);
  }
};
