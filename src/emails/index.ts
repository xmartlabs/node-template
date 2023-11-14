import nodemailer from 'nodemailer';
import pug from 'pug';

import { ApiError } from 'utils/apiError';
import { errors } from 'config/errors';
import { config } from 'config/config';

const emailTransporter = nodemailer.createTransport({
  host: config.emailHost,
  port: config.emailPort,
  auth: {
    user: config.emailServiceProviderUserId,
    pass: config.emailServiceProviderUserPassword,
  },
});

export async function sendEmail(
  emailTo: string,
  subject: string,
  body: string,
  html: string,
) {
  await emailTransporter.sendMail({
    from: config.emailClient,
    to: emailTo,
    subject,
    text: body,
    html,
  });
}

export async function sendSignUpEmail(
  appName: string,
  emailTo: string,
): Promise<void> {
  const subject = `Welcome to ${appName}!`;
  const html = pug.renderFile('src/emails/template.pug', {
    appName,
    username: emailTo,
  });

  await sendEmail(emailTo, subject, '', html);
}
