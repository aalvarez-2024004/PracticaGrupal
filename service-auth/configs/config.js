import dotenv from 'dotenv';
dotenv.config();

export const config = {
  app: {
    port: process.env.PORT || 3001,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'JWTSECRETOnoEmail!',
    expiresIn: process.env.JWT_EXPIRES_IN || '30m',
  },
  security: {
    saltRounds: 12,
  }
};