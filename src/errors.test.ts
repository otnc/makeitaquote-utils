import { describe, expect, it } from 'vitest'
import { errorMessage, MiQError, ValidationError } from './errors'

describe('MiQError', () => {
  it('is a real Error, carrying a cause through', () => {
    const cause = new Error('root cause')
    const error = new MiQError('failed', { cause })

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('MiQError')
    expect(error.message).toBe('failed')
    expect(error.cause).toBe(cause)
  })
})

describe('ValidationError', () => {
  it('is a MiQError carrying the rejected field', () => {
    const error = new ValidationError('bad input', { field: 'text' })

    expect(error).toBeInstanceOf(MiQError)
    expect(error.name).toBe('ValidationError')
    expect(error.field).toBe('text')
  })

  it('leaves field undefined when not given', () => {
    expect(new ValidationError('bad input').field).toBeUndefined()
  })
})

describe('errorMessage (re-exported)', () => {
  it('is the same function as ./errorMessage', () => {
    expect(errorMessage(new Error('boom'))).toBe('boom')
  })
})
