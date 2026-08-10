export function normalizePropName(name: string): string {
  return name.replaceAll(/[-_:]/g, '').toLowerCase()
}

export function toPartName(part: string): string {
  return part.replaceAll(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}

export function getComponentPropNames(
  props: Readonly<Record<string, unknown>> | null | undefined,
): ReadonlySet<string> {
  return new Set(Object.keys(props ?? {}).map((name) => normalizePropName(name)))
}

export function resolveUnstyled(
  local: boolean | undefined,
  vnodeProps: Readonly<Record<string, unknown>> | null | undefined,
  inherited: boolean | undefined,
): boolean {
  const explicitlySet =
    vnodeProps !== null && vnodeProps !== undefined && Object.hasOwn(vnodeProps, 'unstyled')
  return (explicitlySet ? local : undefined) ?? inherited ?? false
}
