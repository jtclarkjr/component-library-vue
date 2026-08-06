<script setup lang="ts">
import { computed, type Component, type PropType } from 'vue'

import { provideClvContext, useClvContext } from '../../headless'
import type { ClvThemeKey } from '../../parts'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  as: { type: [String, Object, Function] as PropType<string | Component>, default: 'div' },
  theme: { type: String as PropType<ClvThemeKey>, default: undefined },
  unstyled: { type: Boolean as PropType<boolean | undefined>, default: undefined },
})

const parent = useClvContext()
const theme = computed<ClvThemeKey>(() => props.theme ?? parent?.theme.value ?? 'default')
const unstyled = computed(() => props.unstyled ?? parent?.unstyled.value ?? false)

provideClvContext({ theme, unstyled })
</script>

<template>
  <component
    :is="as"
    v-bind="$attrs"
    data-clv-component="provider"
    data-part="root"
    :data-clv-theme="theme"
    :data-clv-unstyled="unstyled ? '' : undefined"
  >
    <slot />
  </component>
</template>
