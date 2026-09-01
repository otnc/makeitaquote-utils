import { describe, expect, it } from 'vitest'
import { createClient, deprecate, errorMessage, MiQError, ValidationError } from './index'

describe('index', () => {
  it('re-exports the error classes and errorMessage', () => {
    expect(errorMessage(new Error('boom'))).toBe('boom')
    expect(new MiQError('x')).toBeInstanceOf(Error)
    expect(new ValidationError('x')).toBeInstanceOf(MiQError)
  })

  it('re-exports createClient', () => {
    expect(typeof createClient).toBe('function')
  })

  it('re-exports deprecate', () => {
    expect(typeof deprecate).toBe('function')
  })
})
