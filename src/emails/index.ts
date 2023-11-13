import nodemailer from 'nodemailer';
import pug from 'pug';

import { config } from 'config/config';

const createTransporter = () => {
  const testTransporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPassword,
    },
  });
  return testTransporter;
};

export async function sendSignUpEmail(
  appName: string,
  emailTo: string
): Promise<void> {
  const subject = ` Welcome to ${appName}!!`;
  const html = pug.renderFile('src/emails/template.pug', {
    appName,
    username: emailTo,
  });

  const emailTransporter = createTransporter();
  await emailTransporter.sendMail({
    from: config.emailFrom,
    to: emailTo,
    subject,
    html,
  });
}
