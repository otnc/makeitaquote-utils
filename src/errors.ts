export { errorMessage } from './errorMessage'

export interface MiQErrorOptions {
  cause?: unknown
}

/**
 * Base class for errors shared across `makeitaquote`, `@makeitaquote/voids`
 * and `@makeitaquote/miqx`.
 *
 * Catching `MiQError` catches all of them, from any of the three packages —
 * unlike each package's own additional error classes (`RenderError`,
 * `VoidsApiError`, `MiQXApiError`, …), which stay local to that package.
 */
export class MiQError extends Error {
  constructor(message: string, options?: MiQErrorOptions) {
    super(message, options)
    this.name = 'MiQError'
  }
}

export interface ValidationErrorOptions extends MiQErrorOptions {
  /** Which input field was rejected, e.g. `'text'` or `'theme.text.size'`. */
  field?: string
}

/** An input failed a type, range or presence check. */
export class ValidationError extends MiQError {
  readonly field: string | undefined

  constructor(message: string, options?: ValidationErrorOptions) {
    super(message, options)
    this.name = 'ValidationError'
    this.field = options?.field
  }
}
