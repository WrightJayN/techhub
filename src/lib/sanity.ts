import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'eheqbx25',
  dataset:   import.meta.env.PUBLIC_SANITY_DATASET   || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

// ─── QUERIES ──────────────────────────────────────────────────────

export const BLOG_POSTS_QUERY = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "author": author->name,
    "category": category->title,
    "coverImage": coverImage.asset->url
  }
`;

export const BLOG_POST_QUERY = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    body,
    publishedAt,
    "author": author->name,
    "category": category->title,
    "coverImage": coverImage.asset->url
  }
`;

export const EVENTS_QUERY = `
  *[_type == "event"] | order(date asc) {
    _id,
    title,
    date,
    location,
    description,
    registrationLink
  }
`;
