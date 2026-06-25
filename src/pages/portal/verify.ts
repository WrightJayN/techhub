export const prerender = false;

import type { APIRoute } from 'astro';
import { verifyMagicToken, createSessionCookie } from '../../lib/auth';
import { getAuthorByEmail } from '../../lib/sanity-write';

export const GET: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) return redirect('/portal?error=missing_token');

  const email = await verifyMagicToken(token);
  if (!email) return redirect('/portal?error=invalid_token');

  const author = await getAuthorByEmail(email);
  if (!author) return redirect('/portal?error=not_found');

  const cookie = createSessionCookie(email, author._id);

  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/portal/dashboard',
      'Set-Cookie': cookie,
    },
  });
};
