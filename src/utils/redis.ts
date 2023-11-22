import { appLogger } from 'config/logger';
import IORedis, { RedisOptions } from 'ioredis';
import { config } from 'config/config';

const workerConnectionOptions = {
  host: config.redisHost,
  port: config.redisPort,
  password: config.redisPassword,
  username: config.redisUsername,
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
} as RedisOptions;

export const redisConnection = new IORedis(workerConnectionOptions);

redisConnection.on('error', (err) => {
  appLogger.error(err.message);
  redisConnection.disconnect();
  throw new Error();
});

redisConnection.on('close', () => {
  appLogger.error('Redis connection closed');
  redisConnection.disconnect();
  throw new Error();
});
