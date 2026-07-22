<script setup lang="ts">
import { computed, useId } from 'vue'
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'

import type { ChoiceOption, ClvValue } from '../../types'

const model = defineModel<ClvValue>()
const props = withDefaults(
  defineProps<{
    id?: string
    options: ChoiceOption[]
    label?: string
    help?: string
    error?: string
    placeholder?: string
    name?: string
    required?: boolean
    disabled?: boolean
  }>(),
  { placeholder: 'Select an option', required: false, disabled: false },
)

const generatedId = useId()
const controlId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() =>
  props.help || props.error ? `${controlId.value}-description` : undefined,
)
const selectedOption = computed(() => props.options.find((option) => option.value === model.value))
</script>

<template>
  <div class="clv-select-field">
    <label v-if="label" class="clv-select-field__label" :for="controlId">{{ label }}</label>
    <SelectRoot v-model="model" :name="name" :required="required" :disabled="disabled">
      <SelectTrigger
        :id="controlId"
        class="clv-select"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="descriptionId"
      >
        <SelectValue :placeholder="placeholder">
          <slot name="value" :value="model" :option="selectedOption">
            {{ selectedOption?.label }}
          </slot>
        </SelectValue>
        <SelectIcon class="clv-select__icon" aria-hidden="true">⌄</SelectIcon>
      </SelectTrigger>
      <SelectPortal>
        <SelectContent class="clv-select-content" position="popper" :side-offset="6">
          <SelectViewport class="clv-select-content__viewport">
            <SelectItem
              v-for="option in options"
              :key="option.value"
              class="clv-select-content__item"
              :value="option.value"
              :disabled="option.disabled"
            >
              <SelectItemText>
                <slot name="option" :option="option">{{ option.label }}</slot>
              </SelectItemText>
              <SelectItemIndicator class="clv-select-content__indicator">✓</SelectItemIndicator>
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
    <span v-if="help || error" :id="descriptionId" :class="{ 'clv-select-field__error': error }">
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-select-field {
  display: grid;
  gap: var(--clv-space-2);
  color: var(--clv-color-text-muted);
  font-family: var(--clv-font-sans);
  font-size: 0.875rem;

  &__label {
    color: var(--clv-color-text);
    font-weight: 750;
  }

  &__error {
    color: var(--clv-color-danger);
  }
}

.clv-select {
  @include field;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: var(--clv-space-3);
  padding: 0.65rem 0.8rem;
  cursor: pointer;
  text-align: left;

  &:focus-visible {
    @include focus-ring;
  }

  &:disabled {
    @include disabled;
  }

  &[data-placeholder] {
    color: var(--clv-color-text-muted);
  }

  &__icon {
    color: var(--clv-color-text-muted);
  }
}

.clv-select-content {
  @include floating-surface;
  z-index: 1100;
  min-width: var(--reka-select-trigger-width);
  max-height: min(20rem, var(--reka-select-content-available-height));
  overflow: hidden;
  font-family: var(--clv-font-sans);

  &__viewport {
    padding: var(--clv-space-1);
  }

  &__item {
    position: relative;
    display: flex;
    min-height: 2.25rem;
    align-items: center;
    padding: 0.5rem 2rem 0.5rem 0.7rem;
    border-radius: var(--clv-radius-sm);
    color: var(--clv-color-text);
    cursor: pointer;
    outline: none;

    &[data-highlighted] {
      background: rgb(255 255 255 / 8%);
    }

    &[data-disabled] {
      @include disabled;
    }
  }

  &__indicator {
    position: absolute;
    right: 0.65rem;
    color: var(--clv-color-primary);
  }
}
</style>
