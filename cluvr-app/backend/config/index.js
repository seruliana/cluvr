import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb+srv://saruul3339_db_user:saruul1006@cluvr.fi7ib8o.mongodb.net/?appName=Cluvr',
  jwtSecret: process.env.JWT_SECRET || 'cluvr-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};

export default config;
