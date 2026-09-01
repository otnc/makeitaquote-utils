/** The slice of a Discord user/member `formatUsername()`/`guildName()`/`globalName()` read. */
export interface DiscordAuthorLike {
  username: string
  globalName?: string | null
  global_name?: string | null
  discriminator?: string | null
}

/** The slice of a Discord guild member `guildName()` reads. */
export interface DiscordMemberLike {
  displayName?: string
  nickname?: string | null
}

/**
 * Ask discord.js for a PNG avatar at a sane size.
 *
 * The default `displayAvatarURL()` can hand back an animated WebP, and pulling
 * a 4096px source to draw it small is pure waste. Some older or hand-rolled
 * message objects take no arguments at all, so fall back to a bare call.
 */
export function avatarURL(holder: {
  displayAvatarURL?: (options?: unknown) => string
}): string | null {
  if (typeof holder.displayAvatarURL !== 'function') return null
  try {
    const url = holder.displayAvatarURL({ extension: 'png', size: 512 })
    if (typeof url === 'string' && url.length > 0) return url
  } catch {
    // Falls through to the no-argument form below.
  }
  try {
    const url = holder.displayAvatarURL()
    return typeof url === 'string' && url.length > 0 ? url : null
  } catch {
    return null
  }
}

/**
 * Pre-Pomelo accounts still have a discriminator; migrated ones report `'0'`
 * and are displayed as a bare username.
 */
export function formatUsername(author: DiscordAuthorLike): string {
  const { username, discriminator } = author
  if (typeof discriminator === 'string' && discriminator !== '' && discriminator !== '0') {
    return `${username}#${discriminator}`
  }
  return username
}

/** The per-server nickname, if this message has one. */
export function guildName(message: { member?: DiscordMemberLike | null }): string | null {
  const member = message.member
  if (!member) return null
  if (typeof member.nickname === 'string' && member.nickname) return member.nickname
  // discord.js exposes displayName as "nickname, or the global name"; it is
  // only a guild name when a nickname is actually set, so it is checked second.
  if (typeof member.displayName === 'string' && member.displayName) return member.displayName
  return null
}

/** The account-wide display name, ignoring any server nickname. */
export function globalName(message: { author: DiscordAuthorLike }): string | null {
  const { author } = message
  if (typeof author.globalName === 'string' && author.globalName) return author.globalName
  if (typeof author.global_name === 'string' && author.global_name) return author.global_name
  return null
}
