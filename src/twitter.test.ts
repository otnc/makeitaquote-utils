import { describe, expect, it } from 'vitest'
import { findTweetV2Author, stripTwitterText } from './twitter'

describe('twitter barrel', () => {
  it('re-exports both twitter helpers', () => {
    expect(typeof findTweetV2Author).toBe('function')
    expect(typeof stripTwitterText).toBe('function')
  })
})
