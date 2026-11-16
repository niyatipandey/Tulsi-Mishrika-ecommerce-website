/// <reference types="node" />
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error('RESEND_API_KEY is missing');
  return res.status(500).json({
    error: 'Email service is not configured on the server.',
  });
}

const resend = new Resend(apiKey);

  try {
    const { name, email, phone, subject, message } = req.body || {};

    if (
      !name?.trim() ||
      !email?.trim() ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    if (
      name.length > 100 ||
      email.length > 254 ||
      message.length > 5000 ||
      (phone && phone.length > 30)
    ) {
      return res.status(400).json({ error: 'Some fields are too long.' });
    }

    const { data, error } = await resend.emails.send({
      from: 'Tulsi Mishrika <onboarding@resend.dev>',
      to: ['support.madhuvan@gmail.com'],
      replyTo: email,
      subject: `Website Contact: ${subject}`,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject}

Message:
${message}
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Unable to send your message.' });
    }

    return res.status(200).json({
      success: true,
      id: data?.id,
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
}
