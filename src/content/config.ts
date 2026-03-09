import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1),
    excerpt: z.string().min(1),
    publishedAt: z.date().optional()
  })
});

export const collections = {
  articles
};
