export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { createMagicToken } from '../../../lib/auth';
import { getAuthorByEmail } from '../../../lib/sanity-write';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), { status: 400 });
    }

    // Check this email belongs to a registered author in Sanity
    const author = await getAuthorByEmail(email.toLowerCase().trim());
    if (!author) {
      // Return success anyway to avoid email enumeration
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const token = await createMagicToken(email.toLowerCase().trim());
    const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321';
    const magicLink = `${siteUrl}/portal/verify?token=${encodeURIComponent(token)}`;

    await resend.emails.send({
      from: 'Tech Hub <onboarding@resend.dev>',
      to: email,
      subject: 'Your Tech Hub login link',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="background:#0A0A0A;color:#F0F0F0;font-family:Inter,sans-serif;padding:40px 20px;margin:0;">
          <div style="max-width:480px;margin:0 auto;">
            <div style="margin-bottom:32px;">
              <span style="font-family:sans-serif;font-weight:700;font-size:20px;color:#F0F0F0;">TECH</span>
              <span style="font-family:sans-serif;font-weight:700;font-size:20px;color:#CC0000;">HUB</span>
            </div>
            <h1 style="font-size:24px;font-weight:700;margin-bottom:12px;color:#F0F0F0;">
              Hi ${author.name} 👋
            </h1>
            <p style="color:#888;line-height:1.6;margin-bottom:32px;">
              Click the button below to log in to the Tech Hub author portal.
              This link expires in <strong style="color:#F0F0F0;">15 minutes</strong>.
            </p>
            <a href="${magicLink}"
              style="display:inline-block;background:#CC0000;color:#fff;text-decoration:none;
                     padding:14px 28px;border-radius:4px;font-weight:600;font-size:16px;">
              Log in to Tech Hub →
            </a>
            <p style="color:#555;font-size:13px;margin-top:32px;line-height:1.6;">
              If you didn't request this, you can safely ignore this email.<br/>
              This link can only be used once.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('Magic link error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }
};
