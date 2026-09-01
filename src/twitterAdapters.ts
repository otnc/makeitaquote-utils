import { ValidationError } from './errors'

/** The slice of the official API v2's `UserV2` a `TweetLike` adapter needs to find. */
export interface TweetV2AuthorLike {
  id: string
  username: string
  name?: string | null
  profile_image_url?: string | null
}

/** The slice of the official API v2's `TweetV2` `findTweetV2Author()` reads. */
export interface TweetV2Like {
  author_id?: string
}

/**
 * Matches a v2 tweet to its author in `includes.users`.
 *
 * v2 splits a tweet from its author — `tweet.author_id` names them, but the
 * author itself only comes back when the request asked for the `author_id`
 * expansion, arriving separately in `includes.users`. This is the lookup
 * every package's own `fromTwitterApiV2Tweet()` adapter shares; building the
 * final `TweetLike` from the matched author is package-specific (some need
 * the author's `id` too, some don't).
 */
export function findTweetV2Author<T extends TweetV2AuthorLike>(
  tweet: TweetV2Like,
  includes?: { users?: readonly T[] },
): T {
  const author = includes?.users?.find((user) => user.id === tweet.author_id)
  if (!author) {
    throw new ValidationError(
      'tweet has no matching author in includes.users — request the author_id expansion',
      { field: 'includes' },
    )
  }
  return author
}
