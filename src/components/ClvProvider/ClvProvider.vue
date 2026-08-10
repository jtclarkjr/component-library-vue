<script setup lang="ts">
import { computed, type Component, type PropType } from 'vue'

import { CLV_THEME_MODES, provideClvContext, useClvContext } from '../../headless'
import type { ClvThemeKey, ClvThemeMode, ClvThemeModeInput } from '../../parts'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  as: { type: [String, Object, Function] as PropType<string | Component>, default: 'div' },
  theme: { type: String as PropType<ClvThemeKey>, default: undefined },
  mode: { type: String as PropType<ClvThemeModeInput>, default: undefined },
  unstyled: { type: Boolean as PropType<boolean | undefined>, default: undefined },
})

const parent = useClvContext()
const theme = computed<ClvThemeKey>(() => props.theme ?? parent?.theme.value ?? 'default')
const explicitMode = computed<ClvThemeMode | undefined>(() => {
  if (typeof props.mode !== 'string') return undefined

  const normalizedMode = props.mode.trim().toLowerCase()
  return CLV_THEME_MODES.find((candidate) => candidate === normalizedMode)
})
const resolvedMode = computed<ClvThemeMode | undefined>(
  () =>
    explicitMode.value ?? parent?.mode.value ?? (theme.value === 'neutral' ? 'dark' : undefined),
)
const unstyled = computed(() => props.unstyled ?? parent?.unstyled.value ?? false)

provideClvContext({ mode: resolvedMode, theme, unstyled })
</script>

<template>
  <component
    :is="as"
    v-bind="$attrs"
    data-clv-component="provider"
    data-part="root"
    :data-clv-theme="theme"
    :data-clv-theme-mode="resolvedMode"
    :data-clv-unstyled="unstyled ? '' : undefined"
  >
    <slot />
  </component>
</template>
