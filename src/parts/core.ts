import type { HTMLAttributes } from 'vue'

export type ClvBuiltInThemeKey = 'default' | 'aqua' | 'neutral'
export type ClvThemeKey = ClvBuiltInThemeKey | (string & Record<never, never>)
export type ClvBuiltInThemeMode = 'dark' | 'light'
export type ClvThemeMode = ClvBuiltInThemeMode | (string & Record<never, never>)
type CaseInsensitive<S extends string> = S extends `${infer Head}${infer Tail}`
  ? `${Lowercase<Head> | Uppercase<Head>}${CaseInsensitive<Tail>}`
  : S
export type ClvThemeModeInput = CaseInsensitive<ClvBuiltInThemeMode> | ClvThemeMode

type UnsafePartAttribute =
  | 'innerHTML'
  | 'textContent'
  | 'ref'
  | 'key'
  | 'onVnodeBeforeMount'
  | 'onVnodeMounted'
  | 'onVnodeBeforeUpdate'
  | 'onVnodeUpdated'
  | 'onVnodeBeforeUnmount'
  | 'onVnodeUnmounted'

export type ClvPartAttrs = Omit<HTMLAttributes, UnsafePartAttribute> & {
  readonly innerHTML?: never
  readonly textContent?: never
  readonly ref?: never
  readonly key?: never
  readonly [name: `aria-${string}`]: string | number | boolean | undefined
  readonly [name: `data-${string}`]: unknown
  readonly [name: string]: unknown
}

export interface ClvPartContext<P extends string = string> {
  part: P
  theme?: ClvThemeKey
  mode?: ClvThemeMode
  unstyled: boolean
}

export type ClvPartResolver<C extends ClvPartContext = ClvPartContext> =
  | ClvPartAttrs
  | ((context: Readonly<C>) => ClvPartAttrs | undefined)

export type ClvParts<C extends ClvPartContext> = {
  readonly [P in C['part']]?: ClvPartResolver<Extract<C, { part: P }>>
}

export interface ClvCommonPartState {
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  loading?: boolean
  open?: boolean
  orientation?: 'horizontal' | 'vertical'
  size?: string
  variant?: string
}

export type ClvPartContexts<
  P extends string,
  Extra extends object = Record<never, never>,
> = P extends P ? ClvPartContext<P> & ClvCommonPartState & Extra : never
