import express, { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { signupValidator, loginValidator } from './utils/validators';
import config from './config';
import { signup, login } from './controllers';
import { withValidator, withAuth } from './utils/middlewares';
import { AuthRequest } from './interfaces';

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
    res.send('pong');
  });

  app.post('/api/signup', signupValidator, withValidator, (req: Request<null>, res: Response) => signup(req, res, db));

  app.post('/api/login', loginValidator, withValidator, (req: Request<null>, res: Response) => login(req, res, db));

  app.listen(config.port, () => {
    console.log(`server running on ${config.port}`);
  });
};

main();
