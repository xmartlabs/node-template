import { JobsOptions, Queue } from 'bullmq';
import { appLogger } from 'config/logger';
import { WorkerQueues } from 'types/worker';
import { redisConnection as connection } from 'utils/redis';
import { config } from 'config/config';

const SECONDS_TO_HOURS = 3600;
const MAX_WORKERS_ATTEMPTS = 2;

export const options = {
  removeOnComplete: {
    age: config.jobsRetentionHours * SECONDS_TO_HOURS,
  },
  removeOnFail: {
    age: config.jobsRetentionHours * SECONDS_TO_HOURS,
  },
  attempts: MAX_WORKERS_ATTEMPTS,
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

export const addToMailQueue = (jobName: string, data: any) => {
  mailQueue.add(jobName, data)
}
