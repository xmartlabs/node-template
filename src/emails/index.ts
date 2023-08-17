import nodemailer from 'nodemailer';
import pug from 'pug';

import { ApiError } from 'utils/apiError';
import { errors } from 'config/errors';
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

export async function sendEmail(
  emailTo: string,
  subject: string,
  body: string,
  html: string,
) {
  const emailTransporter = await createTransporter();

  return emailTransporter.sendMail({
    from: process.env.EMAIL_CLIENT,
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
  const subject = ` Welcome to ${appName}!!`;
  const html = pug.renderFile('src/emails/template.pug', {
    appName,
    username: emailTo,
  });

  try {
    const emailTransporter = createTransporter();
    await emailTransporter.sendMail({
      from: config.emailClient,
      to: emailTo,
      subject,
      html,
    });
  } catch (rawError) {
    const error = JSON.stringify(rawError);
    console.error(error);
    throw new ApiError(errors.INTERNAL_SERVER_ERROR);
  }
}
