<script setup lang="ts">
import { ColorAreaArea, ColorAreaRoot, ColorAreaThumb } from 'reka-ui'

import { useClvComponent } from '../../headless'
import type { ColorAreaPartContext, ColorAreaParts } from '../../parts'
import type { ClvColorChannel, ClvColorSpace } from '../../types'
import { normalizeCssColor } from '../_shared/color'

const model = defineModel<string>({ default: '#74e0c1' })
const props = withDefaults(
  defineProps<{
    ariaLabel?: string
    colorSpace?: ClvColorSpace
    xChannel?: ClvColorChannel
    yChannel?: ClvColorChannel
    xName?: string
    yName?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    unstyled?: boolean
    parts?: ColorAreaParts
  }>(),
  {
    ariaLabel: 'Color area',
    colorSpace: 'hsl',
    xChannel: 'saturation',
    yChannel: 'lightness',
    required: false,
    disabled: false,
    readonly: false,
  },
)
const { classes, part, slotContext } = useClvComponent<ColorAreaPartContext>('color-area', props)
const emit = defineEmits<{ change: [value: string]; commit: [value: string] }>()

function update(value: string) {
  model.value = normalizeCssColor(value)
}

function change(value: string) {
  emit('change', normalizeCssColor(value))
}

function commit(value: string) {
  emit('commit', normalizeCssColor(value))
}
</script>

<template>
  <ColorAreaRoot
    :class="classes('clv-color-area')"
    @update:model-value="update"
    @change="change"
    @change-end="commit"
    v-bind="part('root', { disabled, readonly, required, colorSpace, xChannel, yChannel })"
    :model-value="model"
    :color-space="colorSpace"
    :x-channel="xChannel"
    :y-channel="yChannel"
    :x-name="xName"
    :y-name="yName"
    :required="required"
    :disabled="disabled || readonly"
    :data-readonly="readonly ? '' : undefined"
    :aria-label="ariaLabel"
  >
    <template #default="{ style }">
      <ColorAreaArea
        :class="classes('clv-color-area__surface')"
        v-bind="
          part('surface', { disabled, readonly, value: model, colorSpace, xChannel, yChannel })
        "
        :style="style"
      >
        <ColorAreaThumb
          :class="classes('clv-color-area__thumb')"
          v-bind="
            part('thumb', { disabled, readonly, value: model, colorSpace, xChannel, yChannel })
          "
        >
          <slot
            name="thumb"
            :value="model"
            :context="
              slotContext('thumb', {
                disabled,
                readonly,
                value: model,
                colorSpace,
                xChannel,
                yChannel,
              })
            "
          >
            <span
              :class="classes('clv-color-area__thumb-color')"
              v-bind="part('thumbSwatch', { disabled, readonly, value: model })"
              :style="{ backgroundColor: model }"
            />
          </slot>
        </ColorAreaThumb>
      </ColorAreaArea>
    </template>
  </ColorAreaRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-color-area {
    width: min(22rem, 100%);

    &__surface {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      border: 1px solid var(--clv-color-border);
      border-radius: var(--clv-radius-lg);
      cursor: crosshair;
      touch-action: none;
    }

    &__thumb {
      display: grid;
      width: 1.35rem;
      height: 1.35rem;
      place-items: center;
      border: 2px solid white;
      border-radius: 999px;
      outline: 1px solid rgb(0 0 0 / 65%);
      box-shadow: 0 1px 4px rgb(0 0 0 / 45%);
      transform: translate(-50%, -50%);
    }

    &__thumb:focus-visible {
      @include focus-ring;
    }

    &__thumb-color {
      width: 0.65rem;
      height: 0.65rem;
      border-radius: inherit;
    }

    &[data-disabled],
    &[data-readonly] {
      @include disabled;
    }
  }
}
</style>
