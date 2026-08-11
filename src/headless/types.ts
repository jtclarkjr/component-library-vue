import type { ComputedRef, MaybeRefOrGetter } from 'vue'

import type {
  ClvBuiltInThemeKey,
  ClvCommonPartState,
  ClvPartContext,
  ClvParts,
  ClvThemeKey,
  ClvThemeMode,
} from '../parts'
import type { ClvResolvedThemeStyle, ClvThemeRegistry } from '../themes'

type ClvData = Record<string, unknown>

export interface ClvContext {
  theme: ComputedRef<ClvThemeKey | undefined>
  mode: ComputedRef<ClvThemeMode | undefined>
  themeBase: ComputedRef<ClvBuiltInThemeKey | undefined>
  themeStyle: ComputedRef<ClvResolvedThemeStyle | undefined>
  themes: ComputedRef<ClvThemeRegistry>
  unstyled: ComputedRef<boolean>
}

export interface UseClvComponentOptions<C extends ClvPartContext & ClvCommonPartState> {
  /** Existing Vue fallthrough attributes for components using `inheritAttrs: false`. */
  attrs?: MaybeRefOrGetter<ClvData | undefined>
  unstyled?: MaybeRefOrGetter<boolean | undefined>
  parts?: MaybeRefOrGetter<ClvParts<C> | undefined>
}

export interface ClvResolvedPartOptions {
  /** Marks a physical or teleported component surface that must carry provider state. */
  surface?: boolean
  /** Marks a surface detached from its provider's DOM subtree by a portal or teleport. */
  detached?: boolean
  /** Attribute names whose internal values cannot be replaced by a part resolver. */
  protected?: readonly string[]
  /** Retains a structural internal class while otherwise running unstyled. */
  preserveClassWhenUnstyled?: boolean
}

/** Opaque template-bind result; resolver inputs remain strongly typed through `ClvPartAttrs`. */
export type ClvResolvedAttrs = Record<never, never>
