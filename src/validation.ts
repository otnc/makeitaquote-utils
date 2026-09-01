import { ValidationError } from './errors'

/** Throws `ValidationError` unless `value` is a string. */
export function assertString(value: unknown, field: string): asserts value is string {
  if (typeof value !== 'string') {
    throw new ValidationError(`${field} must be a string, received ${typeof value}`, { field })
  }
}

/** Throws `ValidationError` unless `value` is a boolean. */
export function assertBoolean(value: unknown, field: string): asserts value is boolean {
  if (typeof value !== 'boolean') {
    throw new ValidationError(`${field} must be a boolean`, { field })
  }
}

/** Throws `ValidationError` if `value` is longer than `max` characters. */
export function assertMaxLength(value: string, max: number, field: string): void {
  if (value.length > max) {
    throw new ValidationError(
      `${field} must be at most ${max} characters, received ${value.length}`,
      {
        field,
      },
    )
  }
}

/**
 * Throws `ValidationError` if `value` is empty after trimming.
 *
 * The last check before rendering or sending — a field can be optional
 * throughout normalization and still be required by the time a quote is
 * actually built.
 */
export function assertNonEmpty(value: string, field: string): void {
  if (value.trim().length === 0) {
    throw new ValidationError(`${field} is required`, { field })
  }
}

/**
 * `assertString` + `assertMaxLength` combined — the shape every package's
 * own `normalizeText()`/`normalizeUsername()`/etc. already followed
 * independently before this existed.
 */
export function normalizeString(value: unknown, field: string, maxLength: number): string {
  assertString(value, field)
  assertMaxLength(value, maxLength, field)
  return value
}

/** A URL string, a `URL`, or raw bytes — the common shape an avatar/icon/watermark image takes. */
export type AvatarLikeSource = string | URL | Uint8Array

/**
 * Validates the common "avatar-shaped" input: a URL string, a `URL`, raw
 * bytes (`Uint8Array`/`Buffer`), or `null`/`undefined` for none.
 *
 * `allowBlob` additionally accepts a `Blob` — only `@makeitaquote/miqx`
 * needs this today, since its API takes multipart uploads the others don't.
 */
export function normalizeAvatarSource(
  value: unknown,
  field: string,
  options?: { allowBlob?: boolean },
): AvatarLikeSource | Blob | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') return value
  if (value instanceof URL) return value
  if (value instanceof Uint8Array) return value
  if (options?.allowBlob && typeof Blob !== 'undefined' && value instanceof Blob) return value

  const kinds = options?.allowBlob
    ? 'string, URL, Buffer, Uint8Array or Blob'
    : 'string, URL, Buffer, Uint8Array or null'
  throw new ValidationError(`${field} must be a ${kinds}`, { field })
}
