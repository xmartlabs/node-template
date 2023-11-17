import nodemailer from 'nodemailer';
import pug from 'pug';

import { ApiError } from 'utils/apiError';
import { errors } from 'config/errors';
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
      from: config.emailFrom,
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
