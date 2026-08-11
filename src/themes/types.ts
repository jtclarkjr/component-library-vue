import type { ClvBuiltInThemeKey, ClvThemeMode } from '../parts'

export type ClvThemeCssValue = string | number
export type ClvThemeTokenName = `--clv-${string}`
export type ClvThemeTokens = Partial<Record<ClvThemeTokenName, ClvThemeCssValue>>

export interface ClvThemePalette {
  bg?: ClvThemeCssValue
  surface?: ClvThemeCssValue
  surfaceRaised?: ClvThemeCssValue
  border?: ClvThemeCssValue
  text?: ClvThemeCssValue
  textMuted?: ClvThemeCssValue
  primary?: ClvThemeCssValue
  onPrimary?: ClvThemeCssValue
  primaryHover?: ClvThemeCssValue
  primaryStrong?: ClvThemeCssValue
  danger?: ClvThemeCssValue
  onDanger?: ClvThemeCssValue
  dangerHover?: ClvThemeCssValue
  success?: ClvThemeCssValue
  warning?: ClvThemeCssValue
  info?: ClvThemeCssValue
  selection?: ClvThemeCssValue
  checkerA?: ClvThemeCssValue
  checkerB?: ClvThemeCssValue
  focus?: ClvThemeCssValue
  overlay?: ClvThemeCssValue
  controlOutline?: ClvThemeCssValue
  controlHandleBorder?: ClvThemeCssValue
}

export interface ClvThemeVariant {
  palette?: Readonly<ClvThemePalette>
  tokens?: Readonly<ClvThemeTokens>
}

export interface ClvThemeDefinition extends ClvThemeVariant {
  extends?: ClvBuiltInThemeKey
  defaultMode?: ClvThemeMode
  modes?: Readonly<Record<string, ClvThemeVariant>>
}

export type ClvThemeRegistry = Readonly<Record<string, ClvThemeDefinition>>
export type ClvResolvedThemeStyle = Readonly<Record<string, ClvThemeCssValue>>
