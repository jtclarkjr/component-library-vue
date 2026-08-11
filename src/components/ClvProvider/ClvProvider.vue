<script setup lang="ts">
import { computed, mergeProps, type Component, type PropType, useAttrs } from 'vue'

import type { ClvThemeKey, ClvThemeMode, ClvThemeModeInput } from '../../parts'
import {
  getClvThemeBase,
  getClvThemeDefinition,
  resolveClvThemeMode,
  resolveClvThemeStyle,
  type ClvThemeRegistry,
} from '../../themes'
import { provideClvContext, useClvContext } from '../../headless'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  as: { type: [String, Object, Function] as PropType<string | Component>, default: 'div' },
  theme: { type: String as PropType<ClvThemeKey>, default: undefined },
  mode: { type: String as PropType<ClvThemeModeInput>, default: undefined },
  themes: { type: Object as PropType<ClvThemeRegistry>, default: undefined },
  unstyled: { type: Boolean as PropType<boolean | undefined>, default: undefined },
})

const attrs = useAttrs()
const parent = useClvContext()
const themes = computed<ClvThemeRegistry>(() => ({
  ...parent?.themes.value,
  ...props.themes,
}))
const theme = computed<ClvThemeKey>(() => props.theme ?? parent?.theme.value ?? 'default')
const themeDefinition = computed(() => getClvThemeDefinition(themes.value, theme.value))
const themeBase = computed(() => getClvThemeBase(themeDefinition.value))
const explicitMode = computed<ClvThemeMode | undefined>(() =>
  resolveClvThemeMode(props.mode, themeDefinition.value),
)
const inheritedMode = computed<ClvThemeMode | undefined>(() =>
  resolveClvThemeMode(parent?.mode.value, themeDefinition.value),
)
const defaultMode = computed<ClvThemeMode | undefined>(() =>
  resolveClvThemeMode(themeDefinition.value?.defaultMode, themeDefinition.value),
)
const resolvedMode = computed<ClvThemeMode | undefined>(() =>
  explicitMode.value !== undefined
    ? explicitMode.value
    : (inheritedMode.value ??
      defaultMode.value ??
      (theme.value === 'neutral' ? 'dark' : undefined)),
)
const themeStyle = computed(() => resolveClvThemeStyle(themeDefinition.value, resolvedMode.value))
const unstyled = computed(() => props.unstyled ?? parent?.unstyled.value ?? false)
const rootAttrs = () => mergeProps({ style: themeStyle.value }, attrs)

provideClvContext({ mode: resolvedMode, theme, themeBase, themeStyle, themes, unstyled })
</script>

<template>
  <component
    :is="as"
    v-bind="rootAttrs()"
    data-clv-component="provider"
    data-part="root"
    :data-clv-theme="theme"
    :data-clv-theme-base="themeBase"
    :data-clv-theme-mode="resolvedMode"
    :data-clv-unstyled="unstyled ? '' : undefined"
  >
    <slot />
  </component>
</template>
