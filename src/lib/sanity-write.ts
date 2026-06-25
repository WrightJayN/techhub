import { createClient } from '@sanity/client';

// Write client — uses token for mutations (create/update/delete)
export const sanityWriteClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'eheqbx25',
  dataset:   import.meta.env.PUBLIC_SANITY_DATASET   || 'production',
  apiVersion: '2024-01-01',
  token:     import.meta.env.SANITY_WRITE_TOKEN, // set in Netlify env vars
  useCdn:    false,
});

// Find author by email
export async function getAuthorByEmail(email: string) {
  return sanityWriteClient.fetch(
    `*[_type == "author" && email == $email][0]{ _id, name, email, role }`,
    { email }
  );
}

// Get all posts by author
export async function getPostsByAuthor(authorId: string) {
  return sanityWriteClient.fetch(
    `*[_type == "post" && author._ref == $authorId] | order(publishedAt desc) {
      _id, title, slug, excerpt, publishedAt, "status": select(defined(publishedAt) => "published", "draft")
    }`,
    { authorId }
  );
}

// Get all events (any author can manage events)
export async function getAllEvents() {
  return sanityWriteClient.fetch(
    `*[_type == "event"] | order(date asc) { _id, title, slug, date, location }`
  );
}
