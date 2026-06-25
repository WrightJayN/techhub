import { createClient } from '@sanity/client';

// Returns a fresh client on each call so token is read at runtime
export function getSanityWriteClient() {
  return createClient({
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'eheqbx25',
    dataset:   import.meta.env.PUBLIC_SANITY_DATASET   || 'production',
    apiVersion: '2024-01-01',
    token:     process.env.SANITY_WRITE_TOKEN,
    useCdn:    false,
  });
}

// Keep named export for backwards compat — resolved at call time
export const sanityWriteClient = {
  fetch: (...args: any[]) => getSanityWriteClient().fetch(...args as [any, any]),
  create: (...args: any[]) => getSanityWriteClient().create(...args[0]),
  patch: (id: string) => getSanityWriteClient().patch(id),
  delete: (id: string) => getSanityWriteClient().delete(id),
};

// Find author by email
export async function getAuthorByEmail(email: string) {
  return getSanityWriteClient().fetch(
    `*[_type == "author" && email == $email][0]{ _id, name, email, role }`,
    { email }
  );
}

// Get all posts by author
export async function getPostsByAuthor(authorId: string) {
  return getSanityWriteClient().fetch(
    `*[_type == "post" && author._ref == $authorId] | order(publishedAt desc) {
      _id, title, slug, excerpt, publishedAt, "status": select(defined(publishedAt) => "published", "draft")
    }`,
    { authorId }
  );
}

// Get all events
export async function getAllEvents() {
  return getSanityWriteClient().fetch(
    `*[_type == "event"] | order(date asc) { _id, title, slug, date, location }`
  );
}
