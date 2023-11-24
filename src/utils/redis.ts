import IORedis, { RedisOptions } from 'ioredis';
import { config } from 'config/config';

const workerConnectionOptions = {
  host: config.redisHost,
  port: config.redisPort,
  password: config.redisPassword,
  username: config.redisUsername,
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  showFriendlyErrorStack: config.env !== 'production',
} as RedisOptions;

export const redisConnection = new IORedis(workerConnectionOptions);

redisConnection.on('error', (err) => {
  throw err;
});

redisConnection.on('end', () => {
  throw new Error('Redis connection closed');
});
