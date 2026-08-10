import { inject, provide, type InjectionKey } from 'vue'

import type { ClvContext } from './types'

const CLV_CONTEXT_KEY: InjectionKey<ClvContext> = Symbol('clv-context')

export function useClvContext(): ClvContext | undefined {
  return inject(CLV_CONTEXT_KEY, undefined)
}

export function provideClvContext(context: ClvContext): void {
  provide(CLV_CONTEXT_KEY, context)
}
