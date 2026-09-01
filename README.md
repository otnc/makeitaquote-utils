# @makeitaquote/utils

> Utilities related to "Make it a Quote".

[![npm](https://img.shields.io/npm/v/@makeitaquote/utils)](https://www.npmjs.com/package/@makeitaquote/utils)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/otnc/makeitaquote-utils/ci.yml?branch=main)](https://github.com/otnc/makeitaquote-utils/actions)
[![GitHub](https://img.shields.io/github/license/otnc/makeitaquote-utils)](https://github.com/otnc/makeitaquote-utils/blob/main/LICENSE)
[![Node](https://img.shields.io/node/v/@makeitaquote/utils)](https://www.npmjs.com/package/@makeitaquote/utils)

The ordinary, domain-agnostic pieces shared by [`makeitaquote`](https://github.com/otnc/makeitaquote),
[`@makeitaquote/voids`](https://github.com/otnc/makeitaquote-voids) and
[`@makeitaquote/miqx`](https://github.com/otnc/makeitaquote-miqx) — an HTTP client, shared error
classes, Discord mention/markdown/message helpers, plain-text Markdown/MFM stripping, and a Twitter
v2 author-matching helper. Domain-specific logic (how each package builds its own quote shape, its
own API-specific error subclasses, its own canvas rendering) stays in each package and is not part
of this library.

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
import { findTweetV2Author } from '@makeitaquote/utils/twitter'

const { data: tweet, includes } = await client.v2.singleTweet(id, {
  expansions: ['author_id'],
})
const author = findTweetV2Author(tweet, includes)
```

The root `@makeitaquote/utils` entry point re-exports `./http` and `./errors` for convenience, since
neither pulls in a dependency the other subpaths don't already share.

## Requirements

- Node.js >= 18

## What's in scope

- **`http`** — a shared `ofetch` wrapper (`createClient`, `HTTPError`, `TimeoutError`) with
  `get`/`post`/`head`/`getBuffer`, retry, timeout and `throwHttpErrors` handling.
- **`errors`** — the `MiQError`/`ValidationError` base classes every package's own errors extend,
  plus `errorMessage()`. Each package keeps its own additional error subclasses
  (`RenderError`, `VoidsApiError`, `MiQXApiError`, …) locally.
- **`discord`** — `resolveMentions()` (expands `<@id>`, `<#id>`, `<t:…>` and the rest of Discord's
  raw message tokens), `stripDiscordMarkdown()`, and the message-reading helpers `avatarURL()`,
  `formatUsername()`, `guildName()` and `globalName()`.
- **`markdown`** / **`mfm`** — `stripMarkdown()` (CommonMark + GFM extras) and `stripMfm()`
  (Misskey Flavoured Markup) down to plain text.
- **`twitter`** — `findTweetV2Author()`, the `includes.users` lookup every package's own
  `fromTwitterApiV2Tweet()` adapter shares.

**Not in scope**, and intentionally kept local to each package: how a quote's own fields are built
(`QuoteData` differs per package), each package's client class, and anything tied to
`makeitaquote`'s canvas rendering pipeline — including its own `stripMarkdown`/`stripMfm`/
`stripDiscordMarkdown`, which return styled runs for the renderer rather than plain strings, and are
a different implementation from the ones this package ships.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

Distributed under the [MIT License](./LICENSE).
