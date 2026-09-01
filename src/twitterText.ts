/**
 * Normalizes "Twitter bold/italic" — Unicode Mathematical Alphanumeric
 * Symbols — back to plain ASCII.
 *
 * X has no real rich-text markup for a tweet's body: `text` is always plain,
 * whether it comes from the official API v2 or FxTwitter. What reads as bold
 * or italic there is one of the six Latin-alphabet blocks Unicode assigned in
 * the Mathematical Alphanumeric Symbols range (U+1D400–U+1D7FF) — serif and
 * sans-serif, each in bold, italic and bold-italic — that a client or
 * third-party tool substitutes character-by-character. Two of those six (the
 * serif and sans-serif *bold* blocks) also have their own digit range; italic
 * has none in Unicode, so a styled number is already plain ASCII.
 * `ℎ` (U+210E, PLANCK CONSTANT) is a Unicode compatibility carry-over
 * standing in for italic lowercase h, which the main block never assigned.
 *
 * Anything outside these ranges — including plain (unstyled) sans-serif and
 * monospace, which exist in the same block but were never a "bold/italic"
 * convention — passes through unchanged.
 */
export function stripTwitterText(text: string): string {
  let out = ''
  for (const char of text) {
    out += decode(char.codePointAt(0) as number) ?? char
  }
  return out
}

interface StyledRange {
  /** First code point of the block's `A`. */
  upperStart: number
  /** First code point of the block's `a`. */
  lowerStart: number
  /** First code point of the block's `0`, when this style has a digit range. */
  digitStart?: number
}

const RANGES: readonly StyledRange[] = [
  { upperStart: 0x1d400, lowerStart: 0x1d41a, digitStart: 0x1d7ce },
  { upperStart: 0x1d434, lowerStart: 0x1d44e },
  { upperStart: 0x1d468, lowerStart: 0x1d482 },
  { upperStart: 0x1d5d4, lowerStart: 0x1d5ee, digitStart: 0x1d7ec },
  { upperStart: 0x1d608, lowerStart: 0x1d622 },
  { upperStart: 0x1d63c, lowerStart: 0x1d656 },
]

/** Legacy compatibility code point standing in for italic lowercase h. */
const ITALIC_H = 0x210e

function decode(codePoint: number): string | null {
  if (codePoint === ITALIC_H) return 'h'

  for (const range of RANGES) {
    if (codePoint >= range.upperStart && codePoint < range.upperStart + 26) {
      return String.fromCharCode(65 + (codePoint - range.upperStart))
    }
    if (codePoint >= range.lowerStart && codePoint < range.lowerStart + 26) {
      return String.fromCharCode(97 + (codePoint - range.lowerStart))
    }
    if (
      range.digitStart !== undefined &&
      codePoint >= range.digitStart &&
      codePoint < range.digitStart + 10
    ) {
      return String.fromCharCode(48 + (codePoint - range.digitStart))
    }
  }

  return null
}
