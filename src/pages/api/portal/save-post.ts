export const prerender = false;

import type { APIRoute } from 'astro';
import { parseSessionCookie } from '../../../lib/auth';
import { sanityWriteClient, getAuthorByEmail } from '../../../lib/sanity-write';

export const POST: APIRoute = async ({ request }) => {
  const session = parseSessionCookie(request.headers.get('cookie'));
  if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const { id, title, excerpt, body, categoryTitle, publish } = await request.json();

  if (!title?.trim()) {
    return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400 });
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Find or create category
  let categoryRef = null;
  if (categoryTitle) {
    let cat = await sanityWriteClient.fetch(
      `*[_type == "category" && title == $title][0]{ _id }`,
      { title: categoryTitle }
    );
    if (!cat) {
      cat = await sanityWriteClient.create({ _type: 'category', title: categoryTitle });
    }
    categoryRef = { _type: 'reference', _ref: cat._id };
  }

  const doc: any = {
    _type: 'post',
    title: title.trim(),
    slug: { _type: 'slug', current: slug },
    excerpt: excerpt?.trim() || '',
    body: body ? [{ _type: 'block', _key: 'body0', style: 'normal', children: [{ _type: 'span', _key: 's0', text: body, marks: [] }], markDefs: [] }] : [],
    author: { _type: 'reference', _ref: session.authorId },
    ...(categoryRef && { category: categoryRef }),
    ...(publish && { publishedAt: new Date().toISOString() }),
  };

  let result;
  if (id) {
    // Verify ownership before update
    const existing = await sanityWriteClient.fetch(
      `*[_type == "post" && _id == $id][0]{ "authorId": author._ref }`, { id }
    );
    if (existing?.authorId !== session.authorId) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }
    result = await sanityWriteClient.patch(id).set(doc).commit();
  } else {
    result = await sanityWriteClient.create(doc);
  }

  return new Response(JSON.stringify({ ok: true, id: result._id, slug }), { status: 200 });
};
