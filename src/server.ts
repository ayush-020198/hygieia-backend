import express, { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import { signupValidator } from './utils/validators';
import config from './config';
import { signup } from './controllers';

const app = express();
app.use(express.json());

const main = async () => {
  const client = new MongoClient(config.mongoURI, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(config.dbname);

  app.get('/api/ping', (_req, res) => {
    res.send('pong');
  });

  app.post('/api/signup', signupValidator, (req: Request<null>, res: Response) => signup(req, res, db));

  // app.get('/api/login', (req, res) => {});

  app.listen(config.port, () => {
    console.log(`server running on ${config.port}`);
  });
};

main();
