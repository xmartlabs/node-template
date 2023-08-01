import { errors } from 'config/errors';
import nodemailer from 'nodemailer';
import pug from 'pug';
import { ApiError } from 'utils/apiError';

const createTransporter = async () => {
  const testTransporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.USER_MAILTRAP_ID,
      pass: process.env.USER_MAILTRAP_PASSWORD,
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
    const info = await emailTransporter.sendMail({
      from: process.env.EMAIL_CLIENT,
      to: emailTo,
      subject,
      html,
    });
    console.log('Message sent: %s', info);
  }catch (rawError) {
    const error = JSON.stringify(rawError)
    console.error(error)
    throw new ApiError(errors.INTERNAL_SERVER_ERROR);
  }
}
