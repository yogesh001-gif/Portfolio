import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.RESEND_TO_EMAIL || 'yogeshahlawat@example.com',
      subject: `Portfolio Contact: ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0f0f1a; color: #f0f0f5; border-radius: 12px;">
          <h2 style="color: #a78bfa; margin-bottom: 16px;">New Portfolio Message</h2>
          <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
            <p><strong style="color: #8a8a9a;">Name:</strong> ${name}</p>
            <p><strong style="color: #8a8a9a;">Email:</strong> <a href="mailto:${email}" style="color: #38bdf8;">${email}</a></p>
            <p><strong style="color: #8a8a9a;">Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          <p style="margin-top: 16px; font-size: 12px; color: #5a5a6a;">Sent from your portfolio contact form</p>
        </div>
      `,
      replyTo: email,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
}
