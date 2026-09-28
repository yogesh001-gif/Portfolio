import { Resend } from 'resend';

/* Vercel serverless function: POST /api/contact
   Required env vars (Vercel → Project → Settings → Environment Variables):
     RESEND_API_KEY     – from resend.com
     RESEND_TO_EMAIL    – where messages should arrive (your inbox)
   Optional:
     RESEND_FROM_EMAIL  – verified sender, defaults to Resend's test sender */

const LIMITS = { name: [2, 100], email: [3, 200], message: [10, 5000] };
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map(); // best-effort, per warm instance

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(req.body || '{}');
  } catch {
    return {};
  }
}

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = parseBody(req);
  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const message = String(body.message ?? '').trim();

  // Spam traps: honeypot field filled, or form submitted inhumanly fast.
  // Pretend success so bots don't learn anything.
  const tooFast = body.startedAt && Date.now() - Number(body.startedAt) < 2500;
  if (body.company || tooFast) return res.status(200).json({ success: true });

  for (const [field, [min, max]] of Object.entries(LIMITS)) {
    const v = { name, email, message }[field];
    if (v.length < min || v.length > max) {
      return res.status(400).json({ error: `Please check the ${field} field (${min}–${max} characters).` });
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Too many messages — please try again in a few minutes.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESEND_TO_EMAIL;
  if (!apiKey || !to) {
    console.error('Contact form not configured: set RESEND_API_KEY and RESEND_TO_EMAIL');
    return res.status(503).json({ error: 'The contact form isn’t set up yet — please reach out on LinkedIn instead.' });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
      to,
      replyTo: email,
      subject: `Portfolio message from ${name.replace(/[\r\n]+/g, ' ').slice(0, 80)}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:Segoe UI,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0f0f1a;color:#f0f0f5;border-radius:12px">
          <h2 style="color:#a78bfa;margin:0 0 16px">New portfolio message</h2>
          <p><strong style="color:#8a8a9a">Name:</strong> ${safeName}</p>
          <p><strong style="color:#8a8a9a">Email:</strong> <a href="mailto:${safeEmail}" style="color:#38bdf8">${safeEmail}</a></p>
          <p style="white-space:pre-wrap;line-height:1.6;background:rgba(255,255,255,.05);padding:16px;border-radius:8px">${safeMessage}</p>
        </div>`,
    });
    if (error) throw new Error(error.message || 'Resend error');
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(502).json({ error: 'Failed to send your message. Please try again later.' });
  }
}
