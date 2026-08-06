import {
  computed,
  getCurrentInstance,
  inject,
  mergeProps,
  provide,
  toValue,
  type ComputedRef,
  type InjectionKey,
  type MaybeRefOrGetter,
} from 'vue'

import type {
  ClvCommonPartState,
  ClvPartAttrs,
  ClvPartContext,
  ClvParts,
  ClvThemeKey,
} from '../parts'

type ClvData = Record<string, unknown>

export const CLV_THEME_KEYS = ['default', 'aqua'] as const

export interface ClvContext {
  theme: ComputedRef<ClvThemeKey | undefined>
  unstyled: ComputedRef<boolean>
}

const CLV_CONTEXT_KEY: InjectionKey<ClvContext> = Symbol('clv-context')

export function useClvContext(): ClvContext | undefined {
  return inject(CLV_CONTEXT_KEY, undefined)
}

export function provideClvContext(context: ClvContext): void {
  provide(CLV_CONTEXT_KEY, context)
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
  /** Attribute names whose internal values cannot be replaced by a part resolver. */
  protected?: readonly string[]
  /** Retains a structural internal class while otherwise running unstyled. */
  preserveClassWhenUnstyled?: boolean
}

/** Opaque template-bind result; resolver inputs remain strongly typed through `ClvPartAttrs`. */
export type ClvResolvedAttrs = Record<never, never>

const alwaysProtected = [
  'data-clv-component',
  'data-clv-unstyled',
  'data-disabled',
  'data-invalid',
  'data-loading',
  'data-orientation',
  'data-part',
  'data-readonly',
  'data-size',
  'data-variant',
] as const

/**
 * Part attributes are presentation hooks. Public component props and these nested primitive props
 * carry the component's model/form contract, so a trailing `v-bind="part(...)"` must never be able
 * to replace them on a Reka component.
 */
const authoritativePartProps = new Set([
  'as',
  'aschild',
  'checked',
  'defaultchecked',
  'defaultopen',
  'defaultvalue',
  'expanded',
  'forcemount',
  'form',
  'getchildren',
  'getkey',
  'href',
  'indeterminate',
  'level',
  'modelvalue',
  'open',
  'page',
  'part',
  'pressed',
  'selected',
  'step',
  'value',
])

const authoritativeAriaStates = new Set([
  'aria-busy',
  'aria-checked',
  'aria-current',
  'aria-disabled',
  'aria-expanded',
  'aria-hidden',
  'aria-invalid',
  'aria-modal',
  'aria-multiselectable',
  'aria-orientation',
  'aria-posinset',
  'aria-pressed',
  'aria-readonly',
  'aria-required',
  'aria-selected',
  'aria-setsize',
  'aria-valuemax',
  'aria-valuemin',
  'aria-valuenow',
  'aria-valuetext',
])

const ariaRelationships = new Set([
  'aria-activedescendant',
  'aria-controls',
  'aria-describedby',
  'aria-details',
  'aria-errormessage',
  'aria-flowto',
  'aria-labelledby',
  'aria-owns',
])

function normalizePropName(name: string): string {
  return name.replaceAll(/[-_:]/g, '').toLowerCase()
}

function sanitizeConsumerAttrs(
  attrs: ClvPartAttrs | undefined,
  internalAttrs: Readonly<Record<string, unknown>>,
  componentPropNames: ReadonlySet<string>,
): ClvPartAttrs | undefined {
  if (attrs === undefined) return undefined

  const sanitized = { ...attrs }
  for (const name of Object.keys(sanitized)) {
    const normalizedName = normalizePropName(name)
    const relationshipWithoutInternalValue =
      ariaRelationships.has(name) &&
      Object.hasOwn(internalAttrs, name) &&
      internalAttrs[name] == null

    if (
      name === 'role' ||
      name === 'for' ||
      name.startsWith('onUpdate:') ||
      authoritativeAriaStates.has(name) ||
      (ariaRelationships.has(name) && !relationshipWithoutInternalValue) ||
      authoritativePartProps.has(normalizedName) ||
      componentPropNames.has(normalizedName)
    ) {
      delete sanitized[name]
    }
  }

  return sanitized
}

function toPartName(part: string): string {
  return part.replaceAll(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}

function protectAttrs(
  merged: Record<string, unknown>,
  internal: Record<string, unknown>,
  protectedNames: readonly string[],
): void {
  for (const name of protectedNames) {
    if (ariaRelationships.has(name) && internal[name] == null) continue
    if (Object.hasOwn(internal, name)) merged[name] = internal[name]
  }
}

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
  const componentPropNames = new Set(
    Object.keys(instance?.props ?? {}).map((name) => normalizePropName(name)),
  )
  const unstyled = computed(() => {
    const local = options.unstyled === undefined ? undefined : toValue(options.unstyled)
    const vnodeProps = instance?.vnode.props
    const explicitlySet =
      vnodeProps !== null && vnodeProps !== undefined && Object.hasOwn(vnodeProps, 'unstyled')
    return (explicitlySet ? local : undefined) ?? provider?.unstyled.value ?? false
  })
  const theme = computed<ClvThemeKey | undefined>(() => provider?.theme.value)

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
    const configuredParts = options.parts === undefined ? undefined : toValue(options.parts)
    const resolver = configuredParts?.[name]
    const configuredAttrs: ClvPartAttrs | undefined =
      typeof resolver === 'function' ? resolver(Object.freeze(fullContext)) : resolver

    const builtInAttrs: Record<string, unknown> = { ...internalAttrs }
    if (unstyled.value && !resolveOptions.preserveClassWhenUnstyled) delete builtInAttrs.class

    const booleanStates = {
      'data-disabled': fullContext.disabled,
      'data-invalid': fullContext.invalid,
      'data-loading': fullContext.loading,
      'data-readonly': fullContext.readonly,
    }
    for (const [attribute, active] of Object.entries(booleanStates)) {
      if (!Object.hasOwn(builtInAttrs, attribute))
        builtInAttrs[attribute] = active === true ? '' : undefined
    }
    const valueStates = {
      'data-orientation': fullContext.orientation,
      'data-size': fullContext.size,
      'data-variant': fullContext.variant,
    }
    for (const [attribute, value] of Object.entries(valueStates)) {
      if (!Object.hasOwn(builtInAttrs, attribute)) {
        builtInAttrs[attribute] = typeof value === 'string' ? value : undefined
      }
    }

    builtInAttrs['data-part'] = toPartName(name)
    if (resolveOptions.surface ?? name === 'root') {
      builtInAttrs['data-clv-component'] = component
      builtInAttrs['data-clv-unstyled'] = unstyled.value ? '' : undefined
      if (theme.value !== undefined) builtInAttrs['data-clv-theme'] = theme.value
    }

    const consumerAttrs = sanitizeConsumerAttrs(configuredAttrs, builtInAttrs, componentPropNames)

    const fallthroughAttrs =
      name === 'root' && options.attrs !== undefined ? toValue(options.attrs) : undefined
    const merged = mergeProps(builtInAttrs, fallthroughAttrs ?? {}, consumerAttrs ?? {}) as Record<
      string,
      unknown
    >
    protectAttrs(merged, builtInAttrs, [...alwaysProtected, ...(resolveOptions.protected ?? [])])
    return merged
  }

  function classes<T>(value: T): T | undefined {
    return unstyled.value ? undefined : value
  }

  return { classes, part, slotContext, theme, unstyled }
}
