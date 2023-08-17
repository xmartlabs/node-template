import joi from 'joi';
import dotenv from 'dotenv';
import * as path from 'path';
import { Config } from 'types';
// https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config({ path: path.join(__dirname, 'root/.env') });

const DEFAULT_PORT = 8080;
const DEFAULT_LOG_LEVEL = 'info';

const envVarsSchema = joi.object()
  .keys({
    NODE_ENV: joi.string().valid('production', 'development', 'test').required(),
    PORT: joi.number().default(DEFAULT_PORT),
    LOG_LEVEL: joi.string().valid('error', 'warn', 'info', 'verbose', 'debug', 'silly').default(DEFAULT_LOG_LEVEL).description('Server log level'),
    BASE_URL: joi.string().uri(),
    DATABASE_URL: joi.string().required(),
    ACCESS_TOKEN_SECRET: joi.string().required(),
    REFRESH_TOKEN_SECRET: joi.string().required(),
    ACCESS_TOKEN_EXPIRES_IN: joi.string().required(),
    REFRESH_TOKEN_EXPIRES_IN: joi.string().required(),
    EMAIL_CLIENT: joi.string().required(),
    EMAIL_SERVICE_PROVIDER_USER_ID: joi.string().required(),
    EMAIL_SERVICE_PROVIDER_USER_PASSWORD: joi.string().required(),
    EMAIL_HOST: joi.string().required(),
    EMAIL_PORT: joi.number(),
    APP_NAME: joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

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
  emailClient: envVars.EMAIL_CLIENT,
  emailServiceProviderUserId: envVars.EMAIL_SERVICE_PROVIDER_USER_ID,
  emailServiceProviderUserPassword: envVars.EMAIL_SERVICE_PROVIDER_USER_PASSWORD,
  emailHost: envVars.EMAIL_HOST,
  emailPort: envVars.EMAIL_PORT,
  appName: envVars.APP_NAME,
};
