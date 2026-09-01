import { describe, expect, it } from 'vitest'
import { ValidationError } from './errors'
import { findTweetV2Author } from './twitterAdapters'

describe('findTweetV2Author', () => {
  const tweet = { author_id: '12' }
  const includes = {
    users: [
      { id: '12', username: 'jack', name: 'jack', profile_image_url: 'https://cdn.test/jack.png' },
    ],
  }

  it('matches the author by author_id', () => {
    expect(findTweetV2Author(tweet, includes)).toEqual(includes.users[0])
  })

  it('rejects a tweet with no matching author in includes.users', () => {
    expect(() => findTweetV2Author(tweet, { users: [] })).toThrow(ValidationError)
    expect(() => findTweetV2Author(tweet)).toThrow(ValidationError)
  })
})
