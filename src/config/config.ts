import { z } from 'zod';
import dotenv from 'dotenv';
import * as path from 'path';
import { Config } from 'types';

dotenv.config({ path: path.join(__dirname, 'root/.env') });

const DEFAULT_PORT = 8080;
const DEFAULT_LOG_LEVEL = 'info';

const envVarsSchema = z
  .object({
    NODE_ENV: z.enum(['production', 'development', 'test']),
    PORT: z
      .string()
      .transform((val) => (val ? Number(val) : DEFAULT_PORT))
      .refine((val) => !Number.isNaN(val), 'PORT must be a number'),
    LOG_LEVEL: z
      .enum(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
      .default(DEFAULT_LOG_LEVEL),
    BASE_URL: z.string().url(),
    DATABASE_URL: z.string(),
    ACCESS_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRES_IN: z.string(),
    REFRESH_TOKEN_EXPIRES_IN: z.string(),
    EMAIL_FROM: z.string(),
    SMTP_USER: z.string(),
    SMTP_PASSWORD: z.string(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !Number.isNaN(val), 'EMAIL PORT must be a number'),
    APP_NAME: z.string(),
  })
  .passthrough();

const envVars = envVarsSchema.parse(process.env);

export const isDevelopment = envVars.NODE_ENV === 'development';
export const isTest = envVars.NODE_ENV === 'test';
export const isProduction = envVars.NODE_ENV === 'production';

export const config: Config = {
  env: envVars.NODE_ENV,
  logLevel: envVars.LOG_LEVEL,
  port: envVars.PORT,
  baseUrl: envVars.BASE_URL,
  accessTokenSecret: envVars.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: envVars.REFRESH_TOKEN_SECRET,
  accessTokenExpiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenExpiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN,
  emailFrom: envVars.EMAIL_FROM,
  smtpUser: envVars.SMTP_USER,
  smtpPassword: envVars.SMTP_PASSWORD,
  smtpHost: envVars.SMTP_HOST,
  smtpPort: envVars.SMTP_PORT,
  appName: envVars.APP_NAME,
};
