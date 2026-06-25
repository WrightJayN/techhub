export const prerender = false;

import type { APIRoute } from 'astro';
import { parseSessionCookie } from '../../../lib/auth';
import { getSanityWriteClient } from '../../../lib/sanity-write';

export const POST: APIRoute = async ({ request }) => {
  const session = parseSessionCookie(request.headers.get('cookie'));
  if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const { id, type } = await request.json();
  if (!id || !['post', 'event'].includes(type)) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }

  // For posts, verify the author owns it
  if (type === 'post') {
    const post = await getSanityWriteClient().fetch(
      `*[_type == "post" && _id == $id][0]{ "authorId": author._ref }`,
      { id }
    );
    if (post?.authorId !== session.authorId) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }
  }

  await getSanityWriteClient().delete(id);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
