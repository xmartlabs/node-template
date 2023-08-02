import nodemailer from 'nodemailer';
import pug from 'pug';

import { ApiError } from 'utils/apiError';
import { errors } from 'config/errors';


const createTransporter = async () => {
  const testTransporter = nodemailer.createTransport({ 
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_SERVICE_PROVIDER_USER_ID,
      pass: process.env.EMAIL_SERVICE_PROVIDER_USER_PASSWORD,
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
    const emailTransporter = await createTransporter();
    await emailTransporter.sendMail({
      from: process.env.EMAIL_CLIENT,
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
