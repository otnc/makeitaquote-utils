# @makeitaquote/utils

> Utilities related to "Make it a Quote".

[![npm](https://img.shields.io/npm/v/@makeitaquote/utils)](https://www.npmjs.com/package/@makeitaquote/utils)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/otnc/makeitaquote-utils/ci.yml?branch=main)](https://github.com/otnc/makeitaquote-utils/actions)
[![GitHub](https://img.shields.io/github/license/otnc/makeitaquote-utils)](https://github.com/otnc/makeitaquote-utils/blob/main/LICENSE)
[![Node](https://img.shields.io/node/v/@makeitaquote/utils)](https://www.npmjs.com/package/@makeitaquote/utils)

The ordinary, domain-agnostic pieces shared by [`makeitaquote`](https://github.com/otnc/makeitaquote),
[`@makeitaquote/voids`](https://github.com/otnc/makeitaquote-voids) and
[`@makeitaquote/miqx`](https://github.com/otnc/makeitaquote-miqx) — an HTTP client, shared error
classes, input-validation primitives, a deprecation-warning helper, Discord mention/markdown/message
helpers, plain-text Markdown/MFM/Twitter-text normalization, and a Twitter v2 author-matching helper.
Domain-specific logic (how each package builds its own quote shape, its own API-specific error
subclasses, its own canvas rendering) stays in each package and is not part of this library.

## Install

```sh
npm install @makeitaquote/utils
```

## Usage

Every export is available from a subpath, so a consumer only pays for the dependencies it actually
uses — importing `@makeitaquote/utils/http` never pulls in `markdown-it` or `mfm-js`.

```ts
import { createClient, HTTPError, TimeoutError } from '@makeitaquote/utils/http'

const client = createClient({ timeout: 10_000, retry: 2 })
const response = await client.get('https://example.com/')
const buffer = await client.getBuffer('https://example.com/image.png')
```

```ts
import { errorMessage, MiQError, ValidationError } from '@makeitaquote/utils/errors'

try {
  throw new ValidationError('text is required', { field: 'text' })
} catch (cause) {
  if (cause instanceof MiQError) console.error(errorMessage(cause))
}
```

```ts
import {
  avatarURL,
  formatUsername,
  globalName,
  guildName,
  resolveMentions,
  stripDiscordMarkdown,
} from '@makeitaquote/utils/discord'

const text = resolveMentions(message.content, message)
const plain = stripDiscordMarkdown(text)
const name = guildName(message) ?? globalName(message) ?? formatUsername(message.author)
const avatar = message.member ? avatarURL(message.member) : avatarURL(message.author)
```

```ts
import { stripMarkdown } from '@makeitaquote/utils/markdown'
import { stripMfm } from '@makeitaquote/utils/mfm'

stripMarkdown('**bold** text') // 'bold text'
stripMfm('$[jelly ぷりん]') // 'ぷりん'
```

```ts
import { findTweetV2Author, stripTwitterText } from '@makeitaquote/utils/twitter'

const { data: tweet, includes } = await client.v2.singleTweet(id, {
  expansions: ['author_id'],
})
const author = findTweetV2Author(tweet, includes)

stripTwitterText('𝗕𝗼𝗹𝗱 𝟭𝟮𝟯') // 'Bold 123' — X's "bold/italic" is Unicode, not markup
```

```ts
import { normalizeAvatarSource, normalizeString } from '@makeitaquote/utils/validation'

const text = normalizeString(input.text, 'text', 4000) // throws ValidationError if not a string, or too long
const avatar = normalizeAvatarSource(input.avatar, 'avatar') // string | URL | Uint8Array | null
```

```ts
import { deprecate } from '@makeitaquote/utils'

if (options.stripDiscordMarkdown !== undefined) {
  deprecate('MIQ001', 'stripDiscordMarkdown is deprecated, use markdown instead')
}
```

The root `@makeitaquote/utils` entry point re-exports `./http` and `./errors`, plus `deprecate()`/
`resetDeprecationsForTests()`, for convenience — none of them pulls in a dependency the others don't
already share.

## Requirements

- Node.js >= 18

## What's in scope

- **`http`** — a shared `ofetch` wrapper (`createClient`, `HTTPError`, `TimeoutError`) with
  `get`/`post`/`head`/`getBuffer`, retry, timeout and `throwHttpErrors` handling.
- **`errors`** — the `MiQError`/`ValidationError` base classes every package's own errors extend,
  plus `errorMessage()`. Each package keeps its own additional error subclasses
  (`RenderError`, `VoidsApiError`, `MiQXApiError`, …) locally.
- **root (`deprecate`)** — `deprecate()`/`resetDeprecationsForTests()`, a warn-once-per-process
  `DeprecationWarning` helper (`process.emitWarning` under the hood) for retiring an option in favor
  of a new one, the way `stripDiscordMarkdown: true` is deprecated in favor of `markdown: false`.
- **`validation`** — the input-normalization primitives every package's own `quote.ts` validation
  independently re-implemented: `assertString()`, `assertBoolean()`, `assertMaxLength()`,
  `assertNonEmpty()`, `normalizeString()` (the two asserts combined) and `normalizeAvatarSource()`
  (a URL string / `URL` / bytes / `null`, optionally also a `Blob`).
- **`discord`** — `resolveMentions()` (expands `<@id>`, `<#id>`, `<t:…>` and the rest of Discord's
  raw message tokens), `stripDiscordMarkdown()`, and the message-reading helpers `avatarURL()`,
  `formatUsername()`, `guildName()` and `globalName()`.
- **`markdown`** / **`mfm`** — `stripMarkdown()` (CommonMark + GFM extras) and `stripMfm()`
  (Misskey Flavoured Markup) down to plain text, plus `resolveNoteText()` (`mfm`), which picks a
  Misskey note's `text` or `cw` to quote.
- **`twitter`** — `findTweetV2Author()`, the `includes.users` lookup every package's own
  `fromTwitterApiV2Tweet()` adapter shares, and `stripTwitterText()`, which normalizes "Twitter
  bold/italic" (Unicode Mathematical Alphanumeric Symbols) back to plain ASCII.

**Not in scope**, and intentionally kept local to each package: how a quote's own fields are built
(`QuoteData` differs per package), each package's client class, and anything tied to
`makeitaquote`'s canvas rendering pipeline — including its own `stripMarkdown`/`stripMfm`/
`stripDiscordMarkdown`, which return styled runs for the renderer rather than plain strings, and are
a different implementation from the ones this package ships.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

Distributed under the [MIT License](./LICENSE).
