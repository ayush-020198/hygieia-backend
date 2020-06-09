import express, { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import multer from 'multer';
import { signupValidator, loginValidator } from './utils/validators';
import config from './config';
import { signup, login, upload, reports, logout } from './controllers';
import { withValidator, withAuth } from './utils/middlewares';
import { AuthRequest } from './interfaces';

const withUpload = multer();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: config.origins,
    credentials: true,
  })
);
app.use(cookieParser());

const main = async () => {
  const client = new MongoClient(config.mongoURI, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(config.dbname);

  app.get('/api/ping', withAuth, (req: AuthRequest, res) => {
    res.json({ message: 'pong' });
  });

  app.post('/api/signup', signupValidator, withValidator, (req: Request<null>, res: Response) => signup(req, res, db));

  app.post('/api/login', loginValidator, withValidator, (req: Request<null>, res: Response) => login(req, res, db));

  app.get('/api/logout', logout);

  app.post('/api/upload', withAuth, withUpload.single('report'), (req: AuthRequest, res) =>
    upload(req, res, db, client)
  );

  app.get('/api/reports', withAuth, (req: AuthRequest, res) => reports(req, res, db));

  app.listen(config.port, () => {
    console.log(`server running on ${config.port}`);
  });
};

main();
