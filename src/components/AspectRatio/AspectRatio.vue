<script setup lang="ts">
import { AspectRatio as RekaAspectRatio } from 'reka-ui'
import { useClvComponent } from '../../headless'
import type { AspectRatioPartContext, AspectRatioParts } from '../../parts'

const props = withDefaults(
  defineProps<{
    ratio?: number
    label?: string
    unstyled?: boolean
    parts?: AspectRatioParts
  }>(),
  { ratio: 16 / 9 },
)

const { classes, part, slotContext } = useClvComponent<AspectRatioPartContext>(
  'aspect-ratio',
  props,
)
</script>

<template>
  <RekaAspectRatio
    :class="classes('clv-aspect-ratio')"
    v-bind="part('root', { ratio })"
    :ratio="ratio"
    :aria-label="label"
  >
    <slot :context="slotContext('root', { ratio })" />
  </RekaAspectRatio>
</template>

<style scoped lang="scss">
@layer clv.components {
  .clv-aspect-ratio {
    overflow: hidden;
    border: 1px solid var(--clv-color-border);
    border-radius: var(--clv-radius-md);
    background: var(--clv-color-surface);
    color: var(--clv-color-text);
    font-family: var(--clv-font-sans);
  }
}
</style>
