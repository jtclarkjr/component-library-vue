import { colorToString, parseColor } from 'reka-ui'

export function normalizeCssColor(value: string): string {
  try {
    return colorToString(parseColor(value))
  } catch {
    return value
  }
}
