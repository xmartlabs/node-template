import { Application } from 'express';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';

import { redisConnection } from 'utils/redis';
import { hasToApplyRateLimit } from 'config/config';

// Defaults to window of 1 minute and a limit of 5 connections
const authLimiter = rateLimit({
  store: new RedisStore({
    // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
    sendCommand: (...args: string[]) => redisConnection.call(...args),
  }),
});

export const applyRateLimit = (app: Application) => {
  if (hasToApplyRateLimit) {
    // This will make all the routes under the auth controller share the same rate limit
    app.use('*/auth/', authLimiter);
  }
};
