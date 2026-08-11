import type { ClvThemeMode } from '../parts'
import { getClvThemeVariant } from './modes'
import type {
  ClvResolvedThemeStyle,
  ClvThemeCssValue,
  ClvThemeDefinition,
  ClvThemePalette,
  ClvThemeTokenName,
  ClvThemeTokens,
} from './types'

const paletteTokens = [
  ['bg', '--clv-color-bg'],
  ['surface', '--clv-color-surface'],
  ['surfaceRaised', '--clv-color-surface-raised'],
  ['border', '--clv-color-border'],
  ['text', '--clv-color-text'],
  ['textMuted', '--clv-color-text-muted'],
  ['primary', '--clv-color-primary'],
  ['onPrimary', '--clv-color-on-primary'],
  ['primaryHover', '--clv-color-primary-hover'],
  ['primaryStrong', '--clv-color-primary-strong'],
  ['danger', '--clv-color-danger'],
  ['onDanger', '--clv-color-on-danger'],
  ['dangerHover', '--clv-color-danger-hover'],
  ['success', '--clv-color-success'],
  ['warning', '--clv-color-warning'],
  ['info', '--clv-color-info'],
  ['selection', '--clv-color-selection'],
  ['checkerA', '--clv-color-checker-a'],
  ['checkerB', '--clv-color-checker-b'],
  ['focus', '--clv-color-focus'],
  ['overlay', '--clv-color-overlay'],
  ['controlOutline', '--clv-color-control-outline'],
  ['controlHandleBorder', '--clv-color-control-handle-border'],
] as const satisfies readonly (readonly [keyof ClvThemePalette, ClvThemeTokenName])[]

function applyPalette(
  style: Record<string, ClvThemeCssValue>,
  palette: Readonly<ClvThemePalette> | undefined,
): void {
  if (palette === undefined) return
  for (const [name, token] of paletteTokens) {
    const value = palette[name]
    if (value !== undefined) style[token] = value
  }
}

function applyTokens(
  style: Record<string, ClvThemeCssValue>,
  tokens: Readonly<ClvThemeTokens> | undefined,
): void {
  if (tokens === undefined) return
  for (const [name, value] of Object.entries(tokens)) {
    if (!name.startsWith('--clv-') || (typeof value !== 'string' && typeof value !== 'number')) {
      continue
    }
    style[name] = value
  }
}

export function resolveClvThemeStyle(
  definition: ClvThemeDefinition | undefined,
  mode: ClvThemeMode | undefined,
): ClvResolvedThemeStyle | undefined {
  if (definition === undefined) return undefined
  const style: Record<string, ClvThemeCssValue> = {}
  const variant = getClvThemeVariant(definition, mode)

  applyPalette(style, definition.palette)
  applyTokens(style, definition.tokens)
  applyPalette(style, variant?.palette)
  applyTokens(style, variant?.tokens)

  return Object.keys(style).length === 0 ? undefined : style
}
