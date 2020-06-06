import express from 'express';
import config from './config';
import { MongoClient } from 'mongodb';

const app = express();

const main = async () => {
  const client = new MongoClient(config.mongoURI, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(config.dbname);

  app.get('/ping', (req, res) => {
    res.send('pong');
  });

  app.listen(config.port, () => {
    console.log(`server running on ${config.port}`);
  });
};

main();
