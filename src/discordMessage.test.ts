import { describe, expect, it } from 'vitest'
import { avatarURL, formatUsername, globalName, guildName } from './discordMessage'

describe('avatarURL', () => {
  it('asks for a 512px PNG first', () => {
    let seenOptions: unknown
    const url = avatarURL({
      displayAvatarURL: (options) => {
        seenOptions = options
        return 'https://cdn.discordapp.com/avatars/1/a.png'
      },
    })

    expect(seenOptions).toEqual({ extension: 'png', size: 512 })
    expect(url).toBe('https://cdn.discordapp.com/avatars/1/a.png')
  })

  it('falls back to the no-argument form when the options overload throws', () => {
    const url = avatarURL({
      displayAvatarURL: (options) => {
        if (options !== undefined) throw new TypeError('no options accepted')
        return 'https://example.test/a.png'
      },
    })

    expect(url).toBe('https://example.test/a.png')
  })

  it('returns null when there is no displayAvatarURL method', () => {
    expect(avatarURL({})).toBeNull()
  })

  it('returns null when both forms throw or return nothing', () => {
    expect(avatarURL({ displayAvatarURL: () => '' })).toBeNull()
  })
})

describe('formatUsername', () => {
  it('appends the discriminator for a legacy account', () => {
    expect(formatUsername({ username: 'otoneko', discriminator: '6666' })).toBe('otoneko#6666')
  })

  it('drops the discriminator when it is the migrated placeholder', () => {
    expect(formatUsername({ username: 'otoneko.', discriminator: '0' })).toBe('otoneko.')
  })

  it('drops the discriminator when absent', () => {
    expect(formatUsername({ username: 'otoneko.' })).toBe('otoneko.')
  })
})

describe('guildName', () => {
  it('prefers the nickname', () => {
    expect(guildName({ member: { nickname: 'ねこ', displayName: 'otoneko' } })).toBe('ねこ')
  })

  it('falls back to displayName when there is no nickname', () => {
    expect(guildName({ member: { displayName: 'otoneko' } })).toBe('otoneko')
  })

  it('returns null when there is no member', () => {
    expect(guildName({ member: null })).toBeNull()
    expect(guildName({})).toBeNull()
  })
})

describe('globalName', () => {
  it('reads globalName', () => {
    expect(globalName({ author: { username: 'otoneko', globalName: '音猫｡' } })).toBe('音猫｡')
  })

  it('accepts the snake_case global_name used by raw gateway payloads', () => {
    expect(globalName({ author: { username: 'otoneko', global_name: '音猫｡' } })).toBe('音猫｡')
  })

  it('returns null when the author has neither', () => {
    expect(globalName({ author: { username: 'otoneko' } })).toBeNull()
  })
})
