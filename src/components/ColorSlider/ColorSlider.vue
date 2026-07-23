<script setup lang="ts">
import { computed } from 'vue'
import { ColorSliderRoot, ColorSliderThumb, ColorSliderTrack } from 'reka-ui'

import type { ClvColorChannel, ClvColorSpace } from '../../types'
import { normalizeCssColor } from '../_shared/color'

const model = defineModel<string>({ default: '#74e0c1' })
const props = withDefaults(
  defineProps<{
    channel: ClvColorChannel
    ariaLabel?: string
    colorSpace?: ClvColorSpace
    orientation?: 'horizontal' | 'vertical'
    inverted?: boolean
    disabled?: boolean
    readonly?: boolean
    name?: string
    required?: boolean
    step?: number
  }>(),
  {
    ariaLabel: undefined,
    colorSpace: 'rgb',
    orientation: 'horizontal',
    inverted: false,
    disabled: false,
    readonly: false,
    required: false,
  },
)
const emit = defineEmits<{ change: [value: string]; commit: [value: string] }>()

const channelLabels: Record<ClvColorChannel, string> = {
  red: 'Red',
  green: 'Green',
  blue: 'Blue',
  hue: 'Hue',
  saturation: 'Saturation',
  lightness: 'Lightness',
  brightness: 'Brightness',
  alpha: 'Alpha',
}
const accessibleLabel = computed(() => props.ariaLabel ?? channelLabels[props.channel])

function update(value: string | object) {
  if (typeof value === 'string') model.value = normalizeCssColor(value)
}

function change(value: string) {
  emit('change', normalizeCssColor(value))
}

function commit(value: string) {
  emit('commit', normalizeCssColor(value))
}
</script>

<template>
  <ColorSliderRoot
    class="clv-color-slider"
    :class="`clv-color-slider--${orientation}`"
    :model-value="model"
    :channel="channel"
    :color-space="colorSpace"
    :orientation="orientation"
    :inverted="inverted"
    :disabled="disabled || readonly"
    :data-readonly="readonly ? '' : undefined"
    :name="name"
    :required="required"
    :step="step"
    @update:model-value="update"
    @change="change"
    @change-end="commit"
  >
    <ColorSliderTrack class="clv-color-slider__track" />
    <ColorSliderThumb
      v-slot="thumbState"
      class="clv-color-slider__thumb"
      :aria-label="accessibleLabel"
    >
      <slot name="thumb" v-bind="thumbState" :value="model">
        <span class="clv-color-slider__thumb-color" :style="{ backgroundColor: model }" />
      </slot>
    </ColorSliderThumb>
  </ColorSliderRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-color-slider {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 999px;
  touch-action: none;
  user-select: none;

  &--horizontal {
    width: min(22rem, 100%);
    height: 1.5rem;
  }

  &--vertical {
    width: 1.5rem;
    height: 14rem;
  }

  &__track {
    @include checkerboard;
    position: absolute;
    inset: 0.35rem 0;
    overflow: hidden;
    border: 1px solid var(--clv-color-border);
    border-radius: 999px;
  }

  &--vertical &__track {
    inset: 0 0.35rem;
  }

  &__thumb {
    display: grid;
    width: 1.4rem;
    height: 1.4rem;
    place-items: center;
    border: 2px solid white;
    border-radius: 999px;
    outline: 1px solid rgb(0 0 0 / 65%);
    box-shadow: 0 1px 4px rgb(0 0 0 / 45%);
  }

  &__thumb:focus-visible {
    @include focus-ring;
  }

  &__thumb-color {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: inherit;
  }

  &[data-disabled],
  &[data-readonly] {
    @include disabled;
  }
}
</style>
