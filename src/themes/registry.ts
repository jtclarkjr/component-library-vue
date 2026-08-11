import { CLV_THEME_KEYS } from '../headless/constants'
import type { ClvBuiltInThemeKey, ClvThemeKey } from '../parts'
import type { ClvThemeDefinition, ClvThemeRegistry } from './types'

export function defineClvThemes<const T extends ClvThemeRegistry>(themes: T): T {
  return themes
}

export function getClvThemeDefinition(
  registry: ClvThemeRegistry,
  theme: ClvThemeKey,
): ClvThemeDefinition | undefined {
  if (CLV_THEME_KEYS.some((builtInTheme) => builtInTheme === theme)) return undefined
  return registry[theme]
}

export function getClvThemeBase(
  definition: ClvThemeDefinition | undefined,
): ClvBuiltInThemeKey | undefined {
  return definition === undefined ? undefined : (definition.extends ?? 'default')
}
