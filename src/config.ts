import dotenv from 'dotenv';

dotenv.config();

export default {
  mongoURI: process.env.MONGO_URI,
  port: process.env.PORT || '4000',
  dbname: 'hygieia',
  origins: [/localhost/, /agrawal\.me/, /127\.0\.0\.1/],
  jwt: {
    secret: process.env.JWT_SECRET,
    expiry: process.env.JWT_EXPIRY || '30d',
  },
};
