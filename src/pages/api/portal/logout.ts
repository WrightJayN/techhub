export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/portal',
      'Set-Cookie': 'hub_session=; Path=/; HttpOnly; Max-Age=0',
    },
  });
};
