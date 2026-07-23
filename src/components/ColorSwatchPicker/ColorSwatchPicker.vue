<script setup lang="ts">
import { computed } from 'vue'
import {
  ColorSwatchPickerItem,
  ColorSwatchPickerItemIndicator,
  ColorSwatchPickerItemSwatch,
  ColorSwatchPickerRoot,
} from 'reka-ui'

import type { ClvValue, ColorSwatchOption } from '../../types'
import { normalizeCssColor } from '../_shared/color'

const model = defineModel<ClvValue | ClvValue[]>()
const props = withDefaults(
  defineProps<{
    options: ColorSwatchOption[]
    label?: string
    multiple?: boolean
    orientation?: 'horizontal' | 'vertical'
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    name?: string
  }>(),
  {
    label: 'Color choices',
    multiple: false,
    orientation: 'horizontal',
    disabled: false,
    readonly: false,
    required: false,
  },
)
const emit = defineEmits<{ change: [value: ClvValue | ClvValue[] | undefined] }>()

const internalModel = computed<string | string[] | undefined>({
  get() {
    if (Array.isArray(model.value)) {
      return model.value
        .map((value) => props.options.find((option) => option.value === value)?.color)
        .filter((color): color is string => Boolean(color))
        .map(normalizeCssColor)
    }
    const option = props.options.find((entry) => entry.value === model.value)
    return option ? normalizeCssColor(option.color) : undefined
  },
  set(value) {
    if (Array.isArray(value)) {
      const selected = value
        .map((color) =>
          props.options.find(
            (option) => normalizeCssColor(option.color) === normalizeCssColor(color),
          ),
        )
        .filter((option): option is ColorSwatchOption => Boolean(option))
        .map((option) => option.value)
      model.value = selected
      emit('change', selected)
      return
    }
    const selected = props.options.find(
      (option) => normalizeCssColor(option.color) === normalizeCssColor(value),
    )?.value
    model.value = selected
    emit('change', selected)
  },
})
</script>

<template>
  <ColorSwatchPickerRoot
    v-model="internalModel"
    class="clv-color-swatch-picker"
    :class="`clv-color-swatch-picker--${orientation}`"
    :aria-label="label"
    :multiple="multiple"
    :orientation="orientation"
    :disabled="disabled || readonly"
    :data-readonly="readonly ? '' : undefined"
    :required="required"
    :name="name"
  >
    <ColorSwatchPickerItem
      v-for="option in options"
      :key="option.value"
      class="clv-color-swatch-picker__option"
      :value="normalizeCssColor(option.color)"
      :disabled="option.disabled"
      :title="option.label"
    >
      <slot
        name="option"
        :option="option"
        :selected="Array.isArray(model) ? model.includes(option.value) : model === option.value"
      >
        <span class="clv-color-swatch-picker__checker">
          <ColorSwatchPickerItemSwatch
            class="clv-color-swatch-picker__swatch"
            :label="option.label"
          />
        </span>
        <span class="clv-color-swatch-picker__label">{{ option.label }}</span>
        <ColorSwatchPickerItemIndicator class="clv-color-swatch-picker__indicator">
          ✓
        </ColorSwatchPickerItemIndicator>
      </slot>
    </ColorSwatchPickerItem>
  </ColorSwatchPickerRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-color-swatch-picker {
  display: flex;
  gap: 0.5rem;
  width: max-content;
  max-width: 100%;

  &--horizontal {
    flex-wrap: wrap;
  }

  &--vertical {
    flex-direction: column;
  }

  &__option {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 0.5rem;
    min-width: 3rem;
    border: 1px solid var(--clv-color-border);
    border-radius: var(--clv-radius-md);
    background: var(--clv-color-surface);
    padding: 0.35rem;
    color: var(--clv-color-text);
    cursor: pointer;
  }

  &--horizontal &__label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }

  &__option:hover:not([data-disabled]) {
    border-color: var(--clv-color-primary);
  }

  &__option:focus-visible {
    @include focus-ring;
  }

  &__option[data-selected] {
    border-color: var(--clv-color-primary);
    box-shadow: inset 0 0 0 1px var(--clv-color-primary);
  }

  &__option[data-disabled],
  &[data-disabled],
  &[data-readonly] {
    @include disabled;
  }

  &__checker {
    @include checkerboard;
    display: grid;
    width: 2rem;
    height: 2rem;
    overflow: hidden;
    border-radius: var(--clv-radius-sm);
  }

  &__swatch {
    width: 100%;
    height: 100%;
  }

  &__indicator {
    color: var(--clv-color-primary);
    font-weight: 800;
  }
}
</style>
