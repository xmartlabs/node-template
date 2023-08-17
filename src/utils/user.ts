import cron from 'node-cron';
import { ReturnUser } from 'types';
import { User } from '@prisma/client';
import { sendSignUpEmail } from 'emails';
import { config } from 'config/config';

export const sendUserWithoutPassword = (user : User) : ReturnUser => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const startSendEmailTask = (email : string) : void => {
  const emailQueue = {
    current: null as string | null,
  };
  if (!emailQueue.current) {
    emailQueue.current = email;
  };
  const sendEmailTask = cron.schedule('* * * * *', () => {
    if (emailQueue.current) {
      const newUserEmail = emailQueue.current;
      sendSignUpEmail(config.appName, newUserEmail);
      emailQueue.current = null;
    }
    sendEmailTask.stop();
  });
};
