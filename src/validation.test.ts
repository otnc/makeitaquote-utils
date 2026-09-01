import { describe, expect, it } from 'vitest'
import { ValidationError } from './errors'
import {
  assertBoolean,
  assertMaxLength,
  assertNonEmpty,
  assertString,
  normalizeAvatarSource,
  normalizeString,
} from './validation'

describe('assertString', () => {
  it('accepts a string', () => {
    expect(() => assertString('hi', 'text')).not.toThrow()
  })

  it('rejects a non-string, naming the field', () => {
    expect(() => assertString(42, 'text')).toThrow(ValidationError)
    try {
      assertString(42, 'text')
    } catch (cause) {
      expect((cause as ValidationError).field).toBe('text')
    }
  })
})

describe('assertBoolean', () => {
  it('accepts a boolean', () => {
    expect(() => assertBoolean(true, 'upload')).not.toThrow()
  })

  it('rejects a non-boolean', () => {
    expect(() => assertBoolean('true', 'upload')).toThrow(ValidationError)
  })
})

describe('assertMaxLength', () => {
  it('accepts a value at or under the limit', () => {
    expect(() => assertMaxLength('a'.repeat(10), 10, 'text')).not.toThrow()
  })

  it('rejects a value over the limit', () => {
    expect(() => assertMaxLength('a'.repeat(11), 10, 'text')).toThrow(ValidationError)
  })
})

describe('assertNonEmpty', () => {
  it('throws when the value is empty or whitespace-only', () => {
    expect(() => assertNonEmpty('', 'text')).toThrow(ValidationError)
    expect(() => assertNonEmpty('   ', 'text')).toThrow(ValidationError)
  })

  it('passes when the value has content', () => {
    expect(() => assertNonEmpty('hi', 'text')).not.toThrow()
  })
})

describe('normalizeString', () => {
  it('accepts a string within the limit', () => {
    expect(normalizeString('hi', 'text', 4000)).toBe('hi')
  })

  it('rejects a non-string', () => {
    expect(() => normalizeString(42, 'text', 4000)).toThrow(ValidationError)
  })

  it('rejects text over the limit', () => {
    expect(() => normalizeString('a'.repeat(4001), 'text', 4000)).toThrow(ValidationError)
  })

  it('accepts a value exactly at the limit', () => {
    expect(normalizeString('a'.repeat(128), 'username', 128)).toHaveLength(128)
  })
})

describe('normalizeAvatarSource', () => {
  it('accepts a string, a URL, a Uint8Array or null', () => {
    expect(normalizeAvatarSource('https://example.test/a.png', 'avatar')).toBe(
      'https://example.test/a.png',
    )
    const url = new URL('https://example.test/a.png')
    expect(normalizeAvatarSource(url, 'avatar')).toBe(url)
    const bytes = new Uint8Array([1, 2, 3])
    expect(normalizeAvatarSource(bytes, 'avatar')).toBe(bytes)
    expect(normalizeAvatarSource(null, 'avatar')).toBeNull()
  })

  it('treats undefined as null', () => {
    expect(normalizeAvatarSource(undefined, 'avatar')).toBeNull()
  })

  it('rejects anything else by default, mentioning null', () => {
    expect(() => normalizeAvatarSource(42, 'avatar')).toThrow(ValidationError)
    expect(() => normalizeAvatarSource(new Blob(['x']), 'avatar')).toThrow(ValidationError)
    try {
      normalizeAvatarSource(42, 'avatar')
    } catch (cause) {
      expect((cause as Error).message).toContain('null')
    }
  })

  it('accepts a Blob when allowBlob is set, and mentions Blob instead of null in the error', () => {
    const blob = new Blob(['x'])
    expect(normalizeAvatarSource(blob, 'icon', { allowBlob: true })).toBe(blob)
    try {
      normalizeAvatarSource(42, 'icon', { allowBlob: true })
      throw new Error('expected a throw')
    } catch (cause) {
      expect((cause as Error).message).toContain('Blob')
      expect((cause as Error).message).not.toContain('null')
    }
  })
})
