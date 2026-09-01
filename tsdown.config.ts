import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    http: 'src/http.ts',
    errors: 'src/errors.ts',
    discord: 'src/discord.ts',
    markdown: 'src/markdown.ts',
    mfm: 'src/mfm.ts',
    twitter: 'src/twitterAdapters.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  // Node >= 22 supports ES2024
  target: 'node22',
  platform: 'node',
})
