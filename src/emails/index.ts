import nodemailer from 'nodemailer';
import pug from 'pug';

import { config } from 'config/config';

const emailTransporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPassword,
  },
});

const sendEmail = async (
  emailTo: string,
  subject: string,
  html: string,
): Promise<void> => {
  await emailTransporter.sendMail({
    from: config.emailFrom,
    to: emailTo,
    subject,
    html,
  });
};

export async function sendSignUpEmail(emailTo: string): Promise<void> {
  const subject = `Welcome to ${config.appName}!!`;
  const html = pug.renderFile('src/emails/signUpTemplate.pug', {
    appName: config.appName,
    username: emailTo,
  });

  await sendEmail(emailTo, subject, html);
}

export const sendResetPasswordCode = async (
  emailTo: string,
  code: string,
): Promise<void> => {
  const subject = `${config.appName} password recovery code`;
  const html = pug.renderFile('src/emails/resetPasswordCodeTemplate.pug', {
    appName: config.appName,
    username: emailTo,
    code,
  });

  await sendEmail(emailTo, subject, html);
};
