import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    http: 'src/http.ts',
    errors: 'src/errors.ts',
    discord: 'src/discord.ts',
    markdown: 'src/markdown.ts',
    mfm: 'src/mfm.ts',
    twitter: 'src/twitter.ts',
    validation: 'src/validation.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  // Matches `engines.node` — nothing here needs newer than the ES2022 that Node 18 fully supports.
  target: 'node18',
  platform: 'node',
})
