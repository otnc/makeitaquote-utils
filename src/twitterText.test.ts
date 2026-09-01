import { describe, expect, it } from 'vitest'
import { stripTwitterText } from './twitterText'

describe('stripTwitterText', () => {
  it('leaves plain text alone', () => {
    expect(stripTwitterText('nothing to decode here')).toBe('nothing to decode here')
  })

  it('decodes sans-serif bold letters and digits back to ASCII', () => {
    // 𝗕𝗼𝗹𝗱 𝟭𝟮𝟯
    expect(stripTwitterText('𝗕𝗼𝗹𝗱 𝟭𝟮𝟯')).toBe('Bold 123')
  })

  it('decodes sans-serif italic letters back to ASCII', () => {
    // 𝘐𝘵𝘢𝘭𝘪𝘤
    expect(stripTwitterText('𝘐𝘵𝘢𝘭𝘪𝘤')).toBe('Italic')
  })

  it('decodes sans-serif bold italic letters back to ASCII', () => {
    // 𝙗𝙤𝙡𝙙 𝙞𝙩𝙖𝙡𝙞𝙘
    expect(stripTwitterText('𝙗𝙤𝙡𝙙 𝙞𝙩𝙖𝙡𝙞𝙘')).toBe('bold italic')
  })

  it('decodes serif bold letters and digits back to ASCII', () => {
    // 𝐁𝐨𝐥𝐝 𝟏𝟐𝟑
    expect(stripTwitterText('𝐁𝐨𝐥𝐝 𝟏𝟐𝟑')).toBe('Bold 123')
  })

  it('decodes serif italic letters back to ASCII', () => {
    // 𝐼𝑡𝑎𝑙𝑖𝑐
    expect(stripTwitterText('𝐼𝑡𝑎𝑙𝑖𝑐')).toBe('Italic')
  })

  it('decodes the legacy italic-h compatibility character', () => {
    // 𝑎𝑙𝑝ℎ𝑎 — italic "alpha" whose "h" comes from the Planck-constant carry-over
    expect(stripTwitterText('𝑎𝑙𝑝ℎ𝑎')).toBe('alpha')
  })

  it('leaves an italic number as plain ASCII — Unicode has no italic digits', () => {
    // 𝘐𝘵𝘢𝘭𝘪𝘤 123
    expect(stripTwitterText('𝘐𝘵𝘢𝘭𝘪𝘤 123')).toBe('Italic 123')
  })

  it('mixes styled and plain text in one string', () => {
    // this is 𝗯𝗼𝗹𝗱 but this is not
    expect(stripTwitterText('this is 𝗯𝗼𝗹𝗱 but this is not')).toBe('this is bold but this is not')
  })

  it('leaves plain (unstyled) sans-serif and monospace characters alone', () => {
    // plain math sans-serif 𝖠 and monospace 𝙰 are not a bold/italic convention
    expect(stripTwitterText('𝖠𝙰')).toBe('𝖠𝙰')
  })
})
