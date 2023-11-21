import nodemailer from 'nodemailer';
import pug from 'pug';

import { config } from 'config/config';

const createTransporter = () => {
  const testTransporter = nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    auth: {
      user: config.emailServiceProviderUserId,
      pass: config.emailServiceProviderUserPassword,
    },
  });
  return testTransporter;
};

export async function sendSignUpEmail(
  appName: string,
  emailTo: string,
): Promise<void> {
  const subject = ` Welcome to ${appName}!!`;
  const html = pug.renderFile('src/emails/template.pug', {
    appName,
    username: emailTo,
  });

  const emailTransporter = createTransporter();
  await emailTransporter.sendMail({
    from: config.emailClient,
    to: emailTo,
    subject,
    html,
  });
}
