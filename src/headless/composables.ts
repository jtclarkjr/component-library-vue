import { computed, getCurrentInstance, toValue } from 'vue'

import type {
  ClvCommonPartState,
  ClvBuiltInThemeKey,
  ClvPartAttrs,
  ClvPartContext,
  ClvThemeKey,
  ClvThemeMode,
} from '../parts'
import type { ClvResolvedThemeStyle } from '../themes'
import { createBuiltInPartAttrs, mergePartAttrs, resolveConfiguredPartAttrs } from './attrs'
import { useClvContext } from './context'
import { getComponentPropNames, resolveUnstyled } from './helpers'
import type { ClvResolvedAttrs, ClvResolvedPartOptions, UseClvComponentOptions } from './types'

/**
 * Resolves provider state and a component's typed part attributes.
 *
 * Vue's `mergeProps` supplies the public merge contract: classes and styles are merged in order,
 * and event listeners run internal-first. Semantic attributes passed through `protected` are then
 * restored so a presentation hook cannot break the component's accessibility or model wiring.
 */
export function useClvComponent<C extends ClvPartContext & ClvCommonPartState>(
  component: string,
  options: UseClvComponentOptions<C> = {},
) {
  const provider = useClvContext()
  const instance = getCurrentInstance()
  const componentPropNames = getComponentPropNames(instance?.props)

  const unstyled = computed(() =>
    resolveUnstyled(
      options.unstyled === undefined ? undefined : toValue(options.unstyled),
      instance?.vnode.props,
      provider?.unstyled.value,
    ),
  )
  const theme = computed<ClvThemeKey | undefined>(() => provider?.theme.value)
  const mode = computed<ClvThemeMode | undefined>(() => provider?.mode.value)
  const themeBase = computed<ClvBuiltInThemeKey | undefined>(() => provider?.themeBase.value)
  const themeStyle = computed<ClvResolvedThemeStyle | undefined>(() => provider?.themeStyle.value)

  function slotContext<K extends C['part']>(
    name: K,
    state: Omit<Extract<C, { part: K }>, keyof ClvPartContext>,
  ): Readonly<Extract<C, { part: K }>> {
    // The part key selects the matching member of the public discriminated resolver union.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return Object.freeze({
      ...state,
      part: name,
      theme: theme.value,
      mode: mode.value,
      unstyled: unstyled.value,
    } as Extract<C, { part: K }>)
  }

  function part<K extends C['part']>(
    name: K,
    context: Omit<Extract<C, { part: K }>, keyof ClvPartContext>,
    internalAttrs: ClvPartAttrs = {},
    resolveOptions: ClvResolvedPartOptions = {},
  ): ClvResolvedAttrs {
    const fullContext = slotContext(name, context)
    const configuredAttrs = resolveConfiguredPartAttrs(
      options.parts === undefined ? undefined : toValue(options.parts),
      name,
      fullContext,
    )
    const builtInAttrs = createBuiltInPartAttrs({
      component,
      context: fullContext,
      internalAttrs,
      name,
      resolveOptions,
      themeBase: themeBase.value,
      themeStyle: themeStyle.value,
    })
    const fallthroughAttrs =
      name === 'root' && options.attrs !== undefined ? toValue(options.attrs) : undefined

    return mergePartAttrs({
      builtInAttrs,
      componentPropNames,
      configuredAttrs,
      directAttrs: resolveOptions.consumerAttrs,
      fallthroughAttrs,
      protectedNames: resolveOptions.protected,
    })
  }

  function classes<T>(value: T): T | undefined {
    return unstyled.value ? undefined : value
  }

  return { classes, mode, part, slotContext, theme, unstyled }
}
