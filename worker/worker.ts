import { Job, Worker } from 'bullmq';
import { appLogger } from 'config/logger';
import { WorkerQueues } from 'types/worker';
import { redisConnection as connection } from 'utils/redis';

async function mailWorkerJobHandler(job: Job) {
  appLogger.info(`handling job: [${job.id}]`);
  console.log({ jobName: job.name, jobId: job.id, data: job.data });
}

const mailWorker = new Worker(WorkerQueues.MAIL_QUEUE, mailWorkerJobHandler, {
  connection,
});

mailWorker.on('ready', () => appLogger.info('Worker started'));

mailWorker.on('error', (err) => {
  appLogger.error(`${mailWorker.name} has errored with ${err.message}`);
});

mailWorker.on('failed', (job, err) => {
  appLogger.error(`${mailWorker.name} has failed for job ${job?.id}, with error ${err.message}`);
});

mailWorker.on('ioredis:close', () => {
  appLogger.error('Mail worker failed due to ioredis connection closed');
  mailWorker.close(true);
});
