<script setup lang="ts">
import { Separator as SeparatorPrimitive } from 'reka-ui'
import { useClvComponent } from '../../headless'
import type { SeparatorPartContext, SeparatorParts } from '../../parts'

const props = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    decorative?: boolean
    label?: string
    unstyled?: boolean
    parts?: SeparatorParts
  }>(),
  { orientation: 'horizontal', decorative: true },
)

const { classes, part } = useClvComponent<SeparatorPartContext>('separator', props)
</script>

<template>
  <SeparatorPrimitive
    :class="classes(['clv-separator', `clv-separator--${orientation}`])"
    v-bind="part('root', { orientation })"
    :orientation="orientation"
    :decorative="decorative"
    :aria-label="decorative ? undefined : label"
  />
</template>

<style scoped lang="scss">
@layer clv.components {
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
}
</style>
