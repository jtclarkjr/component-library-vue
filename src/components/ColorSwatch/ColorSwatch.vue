<script setup lang="ts">
import { computed } from 'vue'
import { ColorSwatch as RekaColorSwatch } from 'reka-ui'

import { useClvComponent } from '../../headless'
import type { ColorSwatchPartContext, ColorSwatchParts } from '../../parts'
import { normalizeCssColor } from '../_shared/color'

const props = withDefaults(
  defineProps<{
    color: string
    label?: string
    size?: 'sm' | 'md' | 'lg'
    checkerboard?: boolean
    rounded?: boolean
    unstyled?: boolean
    parts?: ColorSwatchParts
  }>(),
  {
    label: undefined,
    size: 'md',
    checkerboard: true,
    rounded: false,
  },
)

const normalizedColor = computed(() => normalizeCssColor(props.color))
const { classes, part, slotContext } = useClvComponent<ColorSwatchPartContext>(
  'color-swatch',
  props,
)
</script>

<template>
  <span
    :class="
      classes([
        'clv-color-swatch',
        `clv-color-swatch--${size}`,
        { 'clv-color-swatch--checkerboard': checkerboard, 'clv-color-swatch--rounded': rounded },
      ])
    "
    v-bind="part('root', { color: normalizedColor, size, checkerboard, rounded })"
  >
    <RekaColorSwatch
      :color="normalizedColor"
      :label="label"
      :class="classes('clv-color-swatch__color')"
      v-bind="part('swatch', { color: normalizedColor, size, checkerboard, rounded })"
    >
      <template #default="slotProps">
        <slot
          name="swatch"
          v-bind="slotProps"
          :value="normalizedColor"
          :context="slotContext('swatch', { color: normalizedColor, size, checkerboard, rounded })"
        />
      </template>
    </RekaColorSwatch>
  </span>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-color-swatch {
    display: inline-grid;
    overflow: hidden;
    place-items: stretch;
    border: 1px solid var(--clv-color-border);
    border-radius: var(--clv-radius-md);

    &--checkerboard {
      @include checkerboard;
    }

    &--sm {
      width: 1.5rem;
      height: 1.5rem;
    }

    &--md {
      width: 2.25rem;
      height: 2.25rem;
    }

    &--lg {
      width: 3.5rem;
      height: 3.5rem;
    }

    &--rounded {
      border-radius: 999px;
    }

    &__color {
      width: 100%;
      height: 100%;
      border-radius: inherit;
    }
  }
}
</style>
