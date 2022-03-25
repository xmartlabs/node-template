import joi from 'joi';
import dotenv from 'dotenv';
import * as path from 'path';
import { Config } from '../types';
// https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config({ path: path.join(__dirname, '../../.env') });

const DEFAULT_PORT = 8080;
const DEFAULT_LOG_LEVEL = 'info';

const envVarsSchema = joi.object()
  .keys({
    NODE_ENV: joi.string().valid('production', 'development', 'test').required(),
    PORT: joi.number().default(DEFAULT_PORT),
    LOG_LEVEL: joi.string().valid('error', 'warn', 'info', 'verbose', 'debug', 'silly').default(DEFAULT_LOG_LEVEL).description('Server log level'),
    BASE_URL: joi.string().uri().default('http://localhost:8080'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV || 'development',
  logLevel: envVars.LOG_LEVEL,
  port: envVars.PORT,
  baseUrl: envVars.BASE_URL,
} as Config;
