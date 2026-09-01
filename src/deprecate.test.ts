import { afterEach, describe, expect, it, vi } from 'vitest'
import { deprecate, resetDeprecationsForTests } from './deprecate'

afterEach(() => {
  resetDeprecationsForTests()
  vi.restoreAllMocks()
})

describe('deprecate', () => {
  it('emits a DeprecationWarning with the given code and message', () => {
    const spy = vi.spyOn(process, 'emitWarning').mockImplementation(() => undefined)

    deprecate('MIQ001', 'this option is deprecated')

    expect(spy).toHaveBeenCalledWith('this option is deprecated', {
      type: 'DeprecationWarning',
      code: 'MIQ001',
    })
  })

  it('warns only once per code', () => {
    const spy = vi.spyOn(process, 'emitWarning').mockImplementation(() => undefined)

    deprecate('MIQ001', 'first')
    deprecate('MIQ001', 'second')

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('warns again after resetDeprecationsForTests', () => {
    const spy = vi.spyOn(process, 'emitWarning').mockImplementation(() => undefined)

    deprecate('MIQ001', 'first')
    resetDeprecationsForTests()
    deprecate('MIQ001', 'second')

    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('tracks different codes independently', () => {
    const spy = vi.spyOn(process, 'emitWarning').mockImplementation(() => undefined)

    deprecate('MIQ001', 'a')
    deprecate('MIQ002', 'b')

    expect(spy).toHaveBeenCalledTimes(2)
  })
})
