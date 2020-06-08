import { Request, Response } from 'express';
import { Db } from 'mongodb';
import bcrypt from 'bcrypt';
import openpgp from 'openpgp';
import { DBUser } from '../models';
import { APIResponse } from '../interfaces';

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

type SignupResponse = APIResponse;

export const signup = async (
  req: Request<null, SignupResponse, SignupRequest>,
  res: Response<SignupResponse>,
  db: Db
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const userCol = db.collection<DBUser>('users');

    const exists = await userCol.findOne({ email });
    if (exists) {
      res.status(400).json({ error: 'User already exists.' });
      return;
    }

    const hash = await bcrypt.hash(password, 10);

    const {
      privateKeyArmored: privKey,
      publicKeyArmored: pubKey,
      revocationCertificate: revoke,
    } = await openpgp.generateKey({
      userIds: [{ name, email }],
      curve: 'ed25519',
      passphrase: password,
    });

    await userCol.insertOne({ name, email, hash, reports: [], keys: { privKey, pubKey, revoke } });
    res.json({ message: 'Signup successful!' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
    console.error(err);
  }
};
