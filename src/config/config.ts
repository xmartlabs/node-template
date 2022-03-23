import joi from 'joi';

const DEFAULT_PORT = 8080;
const DEFAULT_LOG_LEVEL = 'info';

const envVarsSchema = joi.object()
  .keys({
    NODE_ENV: joi.string().valid('production', 'development', 'test').required(),
    PORT: joi.number().default(DEFAULT_PORT),
    LOG_LEVEL: joi.string().valid('error', 'warn', 'info', 'verbose', 'debug', 'silly').default(DEFAULT_LOG_LEVEL).description('Server log level'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

interface Config {
  env: string
  logLevel: string
  port: number
}

export default {
  env: envVars.NODE_ENV || 'development',
  logLevel: envVars.ACCESS_LOG_LEVEL,
  port: envVars.PORT,
} as Config;
