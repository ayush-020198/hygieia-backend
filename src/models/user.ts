import { ObjectID } from 'mongodb';
export interface DBUser {
  _id?: ObjectID;
  name: string;
  email: string;
  hash: string;
  reports: ObjectID[];
  keys: {
    privKey: string;
    pubKey: string;
    revoke: string;
  };
}
