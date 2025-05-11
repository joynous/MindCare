import { NextApiRequest, NextApiResponse } from 'next';
const brevo = require('@getbrevo/brevo'); // Use require instead of import

type RequestBody = {
  email: string;
  name: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
};


// Initialize legacy Brevo client
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.apiKey = {
    'api-key': process.env.BREVO_API_KEY
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, name, eventName, eventDate, eventVenue } = req.body as RequestBody;

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.sender = { email: process.env.SENDER_EMAIL!, name: "Mental Health Community" };
    sendSmtpEmail.subject = `Registration Confirmed: ${eventName}`;
    sendSmtpEmail.htmlContent = `
        <p>Hello ${name},</p>
        <h3>Your registration details:</h3>
        <ul>
          <li>Event: ${eventName}</li>
          <li>Date: ${eventDate}</li>
          <li>Venue: ${eventVenue}</li>
        </ul>
        <p>We look forward to seeing you!</p>
      `;

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Brevo error:', error);
      res.status(500).json({ 
        error: error.message || 'Failed to send email',
        details: error.response?.body
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}