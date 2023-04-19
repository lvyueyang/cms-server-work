import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
}));

export const userConfig = registerAs('user', () => ({
  passwordSalt: process.env.PASSWORD_SALT,
  jwtSecret: process.env.JWT_SECRET_KEY,
}));

export const s3AccountConfig = registerAs('s3Account', () => ({
  bucket: process.env.S3_SERVICE_BUCKET,
  key: process.env.S3_SERVICE_KEY,
  secret: process.env.S3_SERVICE_SECRET,
  address: process.env.S3_SERVICE_ADDRESS,
}));

export const emailClientConfig = registerAs('emailClient', () => ({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Boolean(process.env.EMAIL_SECURE === 'true'),
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASS,
  },
  from: process.env.EMAIL_FROM,
}));

export default [databaseConfig, userConfig, s3AccountConfig, emailClientConfig];
