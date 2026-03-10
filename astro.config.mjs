import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const site = process.env.SITE_URL || 'https://vadimchik.github.io';
const base = process.env.BASE_PATH || '/pulsereader';

export default defineConfig({
  site,
  base,
  integrations: [tailwind()]
});
