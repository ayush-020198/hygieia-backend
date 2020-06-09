import { ObjectID } from 'mongodb';

export interface DBReport {
  cid: string;
  userID: ObjectID;
  title: string;
  name: string;
  mime: string;
}
