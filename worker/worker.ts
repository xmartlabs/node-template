import { Job, Worker } from 'bullmq';
import { config } from 'config/config';
import { appLogger } from 'config/logger';
import { sendSignUpEmail } from 'emails';
import { EmailTypes, WorkerQueues } from 'types';
import { redisConnection as connection } from 'utils/redis';

const mailWorkerJobHandler = async (job: Job) => {
  appLogger.info(`Handling job: [${job.id}]`);
  switch (job.data.emailType) {
    case EmailTypes.SIGN_UP:
      sendSignUpEmail(config.appName, job.data.email);
      break;
    default:
  }
};

const mailWorker = new Worker(WorkerQueues.MAIL_QUEUE, mailWorkerJobHandler, {
  connection,
});

mailWorker.on('ready', () => appLogger.info('Worker started'));

mailWorker.on('error', (err) => {
  appLogger.error(`${mailWorker.name} has errored with ${err.message}`);
});

mailWorker.on('failed', (job, err) => {
  appLogger.error(
    `${mailWorker.name} has failed for job ${job?.id}, with error ${err.message}`,
  );
});

mailWorker.on('ioredis:close', () => {
  appLogger.error('Mail worker failed due to ioredis connection closed');
  mailWorker.close(true);
});
