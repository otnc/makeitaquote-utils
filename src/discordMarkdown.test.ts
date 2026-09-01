import { describe, expect, it } from 'vitest'
import { stripDiscordMarkdown } from './discordMarkdown'

// A thin wrapper over `discomd`'s own `strip()`, which has its own exhaustive
// test suite — this only checks the wrapper is actually wired up.
describe('stripDiscordMarkdown', () => {
  it('leaves plain text alone', () => {
    expect(stripDiscordMarkdown('nothing to strip here')).toBe('nothing to strip here')
  })

  it('strips bold, italic and strikethrough', () => {
    expect(stripDiscordMarkdown('**bold**')).toBe('bold')
    expect(stripDiscordMarkdown('*italic*')).toBe('italic')
    expect(stripDiscordMarkdown('~~gone~~')).toBe('gone')
  })

  it('strips a masked link, dropping the url', () => {
    expect(stripDiscordMarkdown('[a link](https://example.com)')).toBe('a link')
  })
})
