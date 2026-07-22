<script setup lang="ts">
import { Separator as SeparatorPrimitive } from 'reka-ui'

withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    decorative?: boolean
    label?: string
  }>(),
  { orientation: 'horizontal', decorative: true },
)
</script>

<template>
  <SeparatorPrimitive
    class="clv-separator"
    :class="`clv-separator--${orientation}`"
    :orientation="orientation"
    :decorative="decorative"
    :aria-label="decorative ? undefined : label"
  />
</template>

<style scoped lang="scss">
.clv-separator {
  flex: none;
  border: 0;
  background: var(--clv-color-border);

  &--horizontal {
    width: 100%;
    height: 1px;
  }

  &--vertical {
    width: 1px;
    height: 100%;
    min-height: 1.5rem;
  }
}
</style>
