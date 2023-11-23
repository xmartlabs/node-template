import { JobsOptions, Queue } from 'bullmq';
import { appLogger } from 'config/logger';
import { WorkerQueues } from 'types/worker';
import { redisConnection as connection } from 'utils/redis';
import { config } from 'config/config';

export const options = {
  removeOnComplete: {
    age: config.jobsRetentionHours * 3600,
  },
  removeOnFail: {
    age: config.jobsRetentionHours * 3600,
  },
  attempts: 2,
} as JobsOptions;

export const mailQueue = new Queue(WorkerQueues.MAIL_QUEUE, {
  connection,
});

mailQueue.on('error', (err) => {
  appLogger.error(`Mail Queue has errored with ${err.message}`);
});

mailQueue.on('ioredis:close', () => {
  appLogger.error('Mail queue failed due to ioredis connection closed');
  mailQueue.close();
});
