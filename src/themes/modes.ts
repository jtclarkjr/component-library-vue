import { CLV_THEME_MODES } from '../headless/constants'
import type { ClvThemeMode } from '../parts'
import type { ClvThemeDefinition, ClvThemeVariant } from './types'

function normalizeMode(value: unknown): ClvThemeMode | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim().toLowerCase()
  return normalized === '' ? undefined : normalized
}

export function getClvThemeVariant(
  definition: ClvThemeDefinition | undefined,
  mode: ClvThemeMode | undefined,
): ClvThemeVariant | undefined {
  if (definition?.modes === undefined || mode === undefined) return undefined
  const entry = Object.entries(definition.modes).find(
    ([name]) => name.trim().toLowerCase() === mode,
  )
  return entry?.[1]
}

export function resolveClvThemeMode(
  value: unknown,
  definition: ClvThemeDefinition | undefined,
): ClvThemeMode | undefined {
  const normalized = normalizeMode(value)
  if (normalized === undefined) return undefined
  if (CLV_THEME_MODES.some((mode) => mode === normalized)) return normalized
  return getClvThemeVariant(definition, normalized) === undefined ? undefined : normalized
}
