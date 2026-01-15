import 'server-only';

import nodemailer from 'nodemailer';

const DEFAULT_HOST = 'smtp.office365.com';
const DEFAULT_PORT = 587;

export type M365MailerConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  to: string;
};

const parsePort = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const getM365MailerConfig = (): M365MailerConfig => {
  const user = process.env.M365_EMAIL?.trim();
  const pass = process.env.M365_PASSWORD;

  if (!user) throw new Error('Missing M365_EMAIL');
  if (!pass) throw new Error('Missing M365_PASSWORD');

  const host = process.env.M365_SMTP_HOST?.trim() || DEFAULT_HOST;
  const port = parsePort(process.env.M365_SMTP_PORT) ?? DEFAULT_PORT;

  const from = (process.env.M365_FROM_EMAIL?.trim() || user).trim();
  const to = (process.env.M365_TO_EMAIL?.trim() || user).trim();

  return { host, port, user, pass, from, to };
};

export const createM365Transport = (config: M365MailerConfig) => {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: false,
    requireTLS: true,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};

export const sendContactEmail = async (input: {
  name: string;
  email: string;
  intent?: string;
  subject?: string;
  message?: string;
}) => {
  const config = getM365MailerConfig();
  const transporter = createM365Transport(config);

  const subjectLine = `New Contact Form Submission from ${input.name}`;
  const text = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.intent?.trim() ? `I'd like to: ${input.intent.trim()}` : null,
    input.subject ? `Subject: ${input.subject}` : null,
    '',
    'Message:',
    input.message?.trim() ? input.message.trim() : '(no message provided)',
  ]
    .filter(Boolean)
    .join('\n');

  await transporter.sendMail({
    from: config.from,
    to: config.to,
    replyTo: input.email,
    subject: subjectLine,
    text,
  });
};

export const sendNewsletterSignupEmail = async (input: { email: string }) => {
  const config = getM365MailerConfig();
  const transporter = createM365Transport(config);

  await transporter.sendMail({
    from: config.from,
    to: config.to,
    replyTo: input.email,
    subject: 'New newsletter signup',
    text: `Email: ${input.email}`,
  });
};
