<script setup lang="ts">
import { computed, useId } from 'vue'
import {
  ComboboxAnchor,
  ComboboxCancel,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui'

import type { ChoiceOption, ClvValue } from '../../types'

const model = defineModel<ClvValue>()
const searchTerm = defineModel<string>('searchTerm', { default: '' })
const props = withDefaults(
  defineProps<{
    id?: string
    options: ChoiceOption[]
    label?: string
    help?: string
    error?: string
    placeholder?: string
    emptyText?: string
    name?: string
    required?: boolean
    disabled?: boolean
    clearable?: boolean
    filter?: (option: ChoiceOption, query: string) => boolean
  }>(),
  {
    placeholder: 'Search options',
    emptyText: 'No results',
    required: false,
    disabled: false,
    clearable: true,
  },
)

const generatedId = useId()
const controlId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() =>
  props.help || props.error ? `${controlId.value}-description` : undefined,
)
const selectedOption = computed(() => props.options.find((option) => option.value === model.value))
const filteredOptions = computed(() => {
  const query = searchTerm.value.trim()
  if (!query) return props.options
  if (props.filter) return props.options.filter((option) => props.filter?.(option, query))
  const normalized = query.toLocaleLowerCase()
  return props.options.filter((option) => option.label.toLocaleLowerCase().includes(normalized))
})

function displayValue(value: ClvValue | undefined) {
  return props.options.find((option) => option.value === value)?.label ?? ''
}
</script>

<template>
  <div class="clv-combobox-field">
    <label v-if="label" class="clv-combobox-field__label" :for="controlId">{{ label }}</label>
    <ComboboxRoot
      v-model="model"
      :disabled="disabled"
      :name="name"
      :required="required"
      :ignore-filter="true"
      :open-on-click="true"
      :open-on-focus="true"
      :reset-model-value-on-clear="true"
    >
      <ComboboxAnchor class="clv-combobox">
        <ComboboxInput
          :id="controlId"
          v-model="searchTerm"
          class="clv-combobox__input"
          :placeholder="placeholder"
          :display-value="displayValue"
          :aria-invalid="error ? 'true' : undefined"
          :aria-describedby="descriptionId"
        />
        <ComboboxCancel
          v-if="clearable && (searchTerm || selectedOption)"
          class="clv-combobox__button"
          aria-label="Clear selection"
        >
          ×
        </ComboboxCancel>
        <ComboboxTrigger class="clv-combobox__button" aria-label="Show options">⌄</ComboboxTrigger>
      </ComboboxAnchor>
      <ComboboxPortal>
        <ComboboxContent
          :force-mount="options.length > 0"
          class="clv-combobox-content"
          position="popper"
          :side-offset="6"
          :aria-label="label ? `${label} options` : 'Options'"
        >
          <ComboboxViewport class="clv-combobox-content__viewport">
            <ComboboxEmpty
              v-if="filteredOptions.length === 0"
              class="clv-combobox-content__empty"
              role="option"
              aria-disabled="true"
            >
              <slot name="empty">{{ emptyText }}</slot>
            </ComboboxEmpty>
            <ComboboxItem
              v-for="option in filteredOptions"
              :key="option.value"
              class="clv-combobox-content__item"
              :value="option.value"
              :disabled="option.disabled"
            >
              <span>
                <slot name="option" :option="option">{{ option.label }}</slot>
              </span>
              <ComboboxItemIndicator class="clv-combobox-content__indicator"
                >✓</ComboboxItemIndicator
              >
            </ComboboxItem>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
    <span v-if="help || error" :id="descriptionId" :class="{ 'clv-combobox-field__error': error }">
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-combobox-field {
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

.clv-combobox {
  @include field;
  display: flex;
  width: 100%;
  align-items: center;

  &:focus-within {
    border-color: var(--clv-color-primary);
    box-shadow: 0 0 0 2px var(--clv-color-focus);
  }

  &__input {
    min-width: 0;
    min-height: 2.55rem;
    flex: 1;
    padding: 0.65rem 0.8rem;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--clv-color-text);
    font: inherit;
  }

  &__button {
    display: inline-flex;
    width: 2rem;
    height: 2rem;
    align-items: center;
    justify-content: center;
    flex: none;
    border: 0;
    background: transparent;
    color: var(--clv-color-text-muted);
    cursor: pointer;
  }
}

.clv-combobox-content {
  @include floating-surface;
  z-index: 1100;
  min-width: var(--reka-combobox-trigger-width);
  max-height: min(20rem, var(--reka-combobox-content-available-height));
  overflow: hidden;
  font-family: var(--clv-font-sans);

  &[data-state='closed'] {
    display: none;
  }

  &__viewport {
    padding: var(--clv-space-1);
  }

  &__empty {
    padding: var(--clv-space-4);
    color: var(--clv-color-text-muted);
    text-align: center;
  }

  &__item {
    position: relative;
    display: flex;
    min-height: 2.25rem;
    align-items: center;
    justify-content: space-between;
    gap: var(--clv-space-4);
    padding: 0.5rem 0.7rem;
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
    color: var(--clv-color-primary);
  }
}
</style>
