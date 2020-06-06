import dotenv from 'dotenv';

dotenv.config();

export default {
  mongoURI: process.env.MONGO_URI,
  port: process.env.PORT || '4000',
  dbname: 'hygieia',
};
