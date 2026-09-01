import { describe, expect, it } from 'vitest'
import {
  avatarURL,
  formatUsername,
  globalName,
  guildName,
  resolveMentions,
  stripDiscordMarkdown,
} from './discord'

describe('discord barrel', () => {
  it('re-exports every Discord helper', () => {
    expect(typeof stripDiscordMarkdown).toBe('function')
    expect(typeof resolveMentions).toBe('function')
    expect(typeof avatarURL).toBe('function')
    expect(typeof formatUsername).toBe('function')
    expect(typeof guildName).toBe('function')
    expect(typeof globalName).toBe('function')
  })
})
