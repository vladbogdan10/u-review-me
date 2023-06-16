import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export type MailData = {
  name: string;
  email: string;
  requestType: string;
  description: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const mailData: MailData = req.body;

  const transporter = nodemailer.createTransport({
    // @ts-ignore
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: {
        name: 'support',
        address: 'support@u-review.me',
      },
      to: 'reirei.inc@gmail.com',
      replyTo: mailData.email,
      subject: `Message from ${mailData.name} | ${mailData.requestType}`,
      text: mailData.description,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(`ERR: ${err}`);

    res.status(500).send('Interal Server Error');
  }
};
