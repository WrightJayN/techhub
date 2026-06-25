export const prerender = false;

import type { APIRoute } from 'astro';
import { parseSessionCookie } from '../../../lib/auth';
import { sanityWriteClient } from '../../../lib/sanity-write';

export const POST: APIRoute = async ({ request }) => {
  const session = parseSessionCookie(request.headers.get('cookie'));
  if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const { id, title, date, location, description, registrationLink } = await request.json();

  if (!title?.trim() || !date) {
    return new Response(JSON.stringify({ error: 'Title and date are required' }), { status: 400 });
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const doc: any = {
    _type: 'event',
    title: title.trim(),
    slug: { _type: 'slug', current: slug },
    date,
    location: location?.trim() || '',
    description: description?.trim() || '',
    ...(registrationLink?.trim() && { registrationLink: registrationLink.trim() }),
  };

  let result;
  if (id) {
    result = await sanityWriteClient.patch(id).set(doc).commit();
  } else {
    result = await sanityWriteClient.create(doc);
  }

  return new Response(JSON.stringify({ ok: true, id: result._id, slug }), { status: 200 });
};
