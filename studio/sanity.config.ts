import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { post } from './schemas/post';
import { author } from './schemas/author';
import { category, event } from './schemas/index';

export default defineConfig({
  name: 'the-hub',
  title: 'Tech Hub — Content Studio',

  // 🔴 Replace with your actual Project ID from sanity.io
  projectId: 'eheqbx25',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(), // lets editors preview GROQ queries
  ],

  schema: {
    types: [post, author, category, event],
  },
});
