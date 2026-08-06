<script setup lang="ts">
import { computed } from 'vue'
import { ColorSliderRoot, ColorSliderThumb, ColorSliderTrack } from 'reka-ui'

import { useClvComponent } from '../../headless'
import type { ColorSliderPartContext, ColorSliderParts } from '../../parts'
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
    unstyled?: boolean
    parts?: ColorSliderParts
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
const { classes, part, slotContext } = useClvComponent<ColorSliderPartContext>(
  'color-slider',
  props,
)

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
    :class="classes(['clv-color-slider', `clv-color-slider--${orientation}`])"
    @update:model-value="update"
    @change="change"
    @change-end="commit"
    v-bind="part('root', { disabled, readonly, required, orientation, channel, value: model })"
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
  >
    <ColorSliderTrack
      :class="classes('clv-color-slider__track')"
      v-bind="part('track', { disabled, readonly, orientation, channel, value: model })"
    />
    <ColorSliderThumb
      v-slot="thumbState"
      :class="classes('clv-color-slider__thumb')"
      v-bind="part('thumb', { disabled, readonly, orientation, channel, value: model })"
      :aria-label="accessibleLabel"
    >
      <slot
        name="thumb"
        v-bind="thumbState"
        :value="model"
        :context="slotContext('thumb', { disabled, readonly, orientation, channel, value: model })"
      >
        <span
          :class="classes('clv-color-slider__thumb-color')"
          v-bind="part('thumbSwatch', { disabled, readonly, orientation, channel, value: model })"
          :style="{ backgroundColor: model }"
        />
      </slot>
    </ColorSliderThumb>
  </ColorSliderRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
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
}
</style>
