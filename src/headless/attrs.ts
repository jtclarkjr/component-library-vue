import { mergeProps } from 'vue'

import type {
  ClvBuiltInThemeKey,
  ClvCommonPartState,
  ClvPartAttrs,
  ClvPartContext,
  ClvParts,
} from '../parts'
import type { ClvResolvedThemeStyle } from '../themes'
import {
  alwaysProtected,
  ariaRelationships,
  authoritativeAriaStates,
  authoritativePartProps,
} from './constants'
import { normalizePropName, toPartName } from './helpers'
import type { ClvResolvedAttrs, ClvResolvedPartOptions } from './types'

type FullPartContext = ClvPartContext & ClvCommonPartState

interface CreateBuiltInPartAttrsOptions {
  component: string
  context: FullPartContext
  internalAttrs: ClvPartAttrs
  name: string
  resolveOptions: ClvResolvedPartOptions
  themeBase: ClvBuiltInThemeKey | undefined
  themeStyle: ClvResolvedThemeStyle | undefined
}

interface MergePartAttrsOptions {
  builtInAttrs: Record<string, unknown>
  componentPropNames: ReadonlySet<string>
  configuredAttrs: ClvPartAttrs | undefined
  fallthroughAttrs: Record<string, unknown> | undefined
  protectedNames: readonly string[] | undefined
}

function setDefaultAttr(attrs: Record<string, unknown>, name: string, value: unknown): void {
  if (!Object.hasOwn(attrs, name)) attrs[name] = value
}

function applyStateAttrs(attrs: Record<string, unknown>, context: FullPartContext): void {
  const booleanStates = {
    'data-disabled': context.disabled,
    'data-invalid': context.invalid,
    'data-loading': context.loading,
    'data-readonly': context.readonly,
  }
  for (const [name, active] of Object.entries(booleanStates)) {
    setDefaultAttr(attrs, name, active === true ? '' : undefined)
  }

  const valueStates = {
    'data-orientation': context.orientation,
    'data-size': context.size,
    'data-variant': context.variant,
  }
  for (const [name, value] of Object.entries(valueStates)) {
    setDefaultAttr(attrs, name, typeof value === 'string' ? value : undefined)
  }
}

function applySurfaceAttrs(
  attrs: Record<string, unknown>,
  component: string,
  context: FullPartContext,
  resolveOptions: ClvResolvedPartOptions,
  themeBase: ClvBuiltInThemeKey | undefined,
  themeStyle: ClvResolvedThemeStyle | undefined,
): void {
  attrs['data-clv-component'] = component
  attrs['data-clv-unstyled'] = context.unstyled ? '' : undefined
  if (context.theme !== undefined) attrs['data-clv-theme'] = context.theme
  if (context.mode !== undefined) attrs['data-clv-theme-mode'] = context.mode
  if (resolveOptions.detached) {
    if (themeBase !== undefined) attrs['data-clv-theme-base'] = themeBase
    if (themeStyle !== undefined) attrs.style = themeStyle
  }
}

export function createBuiltInPartAttrs({
  component,
  context,
  internalAttrs,
  name,
  resolveOptions,
  themeBase,
  themeStyle,
}: CreateBuiltInPartAttrsOptions): Record<string, unknown> {
  const attrs: Record<string, unknown> = { ...internalAttrs }

  if (context.unstyled && !resolveOptions.preserveClassWhenUnstyled) delete attrs.class

  applyStateAttrs(attrs, context)
  attrs['data-part'] = toPartName(name)

  if (resolveOptions.surface ?? name === 'root') {
    applySurfaceAttrs(attrs, component, context, resolveOptions, themeBase, themeStyle)
  }

  return attrs
}

export function resolveConfiguredPartAttrs<
  C extends ClvPartContext & ClvCommonPartState,
  K extends C['part'],
>(
  configuredParts: ClvParts<C> | undefined,
  name: K,
  context: Readonly<Extract<C, { part: K }>>,
): ClvPartAttrs | undefined {
  const resolver = configuredParts?.[name]
  return typeof resolver === 'function' ? resolver(Object.freeze(context)) : resolver
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

export function mergePartAttrs({
  builtInAttrs,
  componentPropNames,
  configuredAttrs,
  fallthroughAttrs,
  protectedNames,
}: MergePartAttrsOptions): ClvResolvedAttrs {
  const consumerAttrs = sanitizeConsumerAttrs(configuredAttrs, builtInAttrs, componentPropNames)
  const merged = mergeProps(builtInAttrs, fallthroughAttrs ?? {}, consumerAttrs ?? {}) as Record<
    string,
    unknown
  >

  protectAttrs(merged, builtInAttrs, [...alwaysProtected, ...(protectedNames ?? [])])

  return merged
}
