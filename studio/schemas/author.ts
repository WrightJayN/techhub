import { defineField, defineType } from 'sanity';

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Full name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'email', title: 'Email address', type: 'string', description: 'Used for magic link login to the author portal.', validation: Rule => Rule.required().email() }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'role', title: 'Role in Tech Hub', type: 'string' }),
    defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
});
