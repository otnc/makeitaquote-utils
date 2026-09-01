import { strip } from 'discomd'

/**
 * Strips Discord-flavoured markdown down to plain text.
 *
 * A message's raw content is quoted exactly as written by default — turning
 * `**bold**` into bold is a choice, not a correction. Call this to opt in.
 *
 * Built on `discomd`, which covers the syntax Discord's own Markdown 101
 * article documents: bold, italic, underline, strikethrough, spoilers,
 * inline code, code blocks, block quotes, headers, subtext, list markers
 * and masked links — `[text](url)` reduces to `text`, the URL dropped.
 */
export function stripDiscordMarkdown(text: string): string {
  return strip(text)
}
