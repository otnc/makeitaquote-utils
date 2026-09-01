#!/usr/bin/env node
// Smoke-tests the built dist/ output directly with `require()`, with no
// dev toolchain involved — this is what actually backs the `engines.node`
// claim in package.json, since tsdown/rolldown themselves need a newer
// Node than the published package does. Run against a downloaded `dist/`
// artifact by the `compat-smoke` CI job; see .github/workflows/ci.yml.

const assert = require('node:assert/strict')

const http = require('../dist/http.cjs')
const errors = require('../dist/errors.cjs')
const discord = require('../dist/discord.cjs')
const markdown = require('../dist/markdown.cjs')
const mfm = require('../dist/mfm.cjs')
const twitter = require('../dist/twitter.cjs')
const validation = require('../dist/validation.cjs')
const index = require('../dist/index.cjs')

assert.equal(typeof http.createClient, 'function')
assert.equal(typeof http.HTTPError, 'function')
assert.equal(typeof http.TimeoutError, 'function')

assert.equal(typeof errors.MiQError, 'function')
assert.equal(typeof errors.ValidationError, 'function')
assert.equal(errors.errorMessage(new Error('boom')), 'boom')

assert.equal(typeof discord.resolveMentions, 'function')
assert.equal(discord.stripDiscordMarkdown('**bold**'), 'bold')
assert.equal(discord.resolveMentions('hi <@1>', {}), 'hi <@1>')
assert.equal(discord.formatUsername({ username: 'a', discriminator: '0' }), 'a')

assert.equal(markdown.stripMarkdown('**bold**'), 'bold')
assert.equal(mfm.stripMfm('$[jelly x]'), 'x')
assert.equal(mfm.resolveNoteText({ text: 'hi', cw: 'spoiler' }), 'hi')

assert.equal(typeof twitter.findTweetV2Author, 'function')
assert.equal(twitter.stripTwitterText('𝗕𝗼𝗹𝗱'), 'Bold')

assert.equal(validation.normalizeString('hi', 'text', 10), 'hi')
assert.throws(() => validation.assertNonEmpty('', 'text'))

assert.equal(typeof index.createClient, 'function')
assert.equal(typeof index.MiQError, 'function')
assert.equal(typeof index.deprecate, 'function')

const client = http.createClient({ retry: 0, timeout: 5000 })
client.get('https://invalid.invalid.test/').catch((cause) => {
  assert.ok(cause instanceof Error)
  console.log(`OK — dist/ loads and runs on Node ${process.version}`)
})
