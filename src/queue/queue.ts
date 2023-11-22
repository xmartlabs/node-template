import { JobsOptions, Queue } from 'bullmq';
import { appLogger } from 'config/logger';
import { WorkerQueues } from 'types/worker';
import { redisConnection as connection } from 'utils/redis';

export const options = {
  removeOnComplete: {
    age: 24 * 3600,
  },
  removeOnFail: {
    age: 24 * 3600,
  },
  attempts: 2,
} as JobsOptions;

// Schedule a new job on the queue with:
// 1. a name that is associated with this job
// 2. any metadata this job should include (a JSON object)
// queue.add('job_name', { ...params }, options);

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
