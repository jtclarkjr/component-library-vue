<script setup lang="ts">
import { AspectRatio as RekaAspectRatio } from 'reka-ui'

withDefaults(
  defineProps<{
    ratio?: number
    label?: string
  }>(),
  { ratio: 16 / 9 },
)
</script>

<template>
  <RekaAspectRatio class="clv-aspect-ratio" :ratio="ratio" :aria-label="label">
    <slot />
  </RekaAspectRatio>
</template>

<style scoped lang="scss">
.clv-aspect-ratio {
  overflow: hidden;
  border: 1px solid var(--clv-color-border);
  border-radius: var(--clv-radius-md);
  background: var(--clv-color-surface);
  color: var(--clv-color-text);
  font-family: var(--clv-font-sans);
}
</style>
