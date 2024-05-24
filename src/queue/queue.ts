import { JobsOptions, Queue } from 'bullmq';
import { appLogger } from 'config/logger';
import { WorkerQueues } from 'types/worker';
import { redisConnection as connection } from 'utils/redis';
import { config } from 'config/config';

const SECONDS_TO_HOURS = 3600;
const MILLISECONDS_TO_SECONDS = 1000;
const MAX_WORKERS_ATTEMPTS = 5;
const BACKOFF_DELAY = 60;

export const options = {
  removeOnComplete: {
    age: config.jobsRetentionHours * SECONDS_TO_HOURS,
  },
  removeOnFail: {
    age: config.jobsRetentionHours * SECONDS_TO_HOURS,
  },
  attempts: MAX_WORKERS_ATTEMPTS,
  backoff: {
    type: 'exponential',
    delay: MILLISECONDS_TO_SECONDS * BACKOFF_DELAY,
  },
} as JobsOptions;

export const mailQueue = new Queue(WorkerQueues.MAIL_QUEUE, {
  connection,
  defaultJobOptions: options,
});

mailQueue.on('error', (err) => {
  appLogger.error(`Mail Queue has errored with ${err.message}`);
});

mailQueue.on('ioredis:close', () => {
  appLogger.error('Mail queue failed due to ioredis connection closed');
  mailQueue.close();
});

export const addToMailQueue = (jobName: string, data: any) => {
  mailQueue.add(jobName, data);
};
