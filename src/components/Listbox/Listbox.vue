<script setup lang="ts">
import { computed, useId } from 'vue'
import {
  ListboxContent,
  ListboxItem,
  ListboxItemIndicator,
  ListboxRoot,
  ListboxVirtualizer,
} from 'reka-ui'

import type { ChoiceOption, ClvValue } from '../../types'

const model = defineModel<ClvValue | ClvValue[]>()
const props = withDefaults(
  defineProps<{
    id?: string
    options: ChoiceOption[]
    multiple?: boolean
    label?: string
    help?: string
    error?: string
    name?: string
    required?: boolean
    disabled?: boolean
    orientation?: 'horizontal' | 'vertical'
    selectionBehavior?: 'toggle' | 'replace'
    virtualize?: boolean
    estimateSize?: number
    overscan?: number
    emptyText?: string
  }>(),
  {
    multiple: false,
    required: false,
    disabled: false,
    orientation: 'vertical',
    selectionBehavior: 'toggle',
    virtualize: false,
    estimateSize: 40,
    overscan: 8,
    emptyText: 'No options available.',
  },
)

const generatedId = useId()
const listboxId = computed(() => props.id ?? generatedId)
const labelId = computed(() => `${listboxId.value}-label`)
const descriptionId = computed(() =>
  props.help || props.error ? `${listboxId.value}-description` : undefined,
)
function selected(value: ClvValue) {
  return Array.isArray(model.value) ? model.value.includes(value) : model.value === value
}
</script>

<template>
  <div class="clv-listbox-field">
    <span v-if="label" :id="labelId" class="clv-listbox-field__label">{{ label }}</span>
    <ListboxRoot
      :id="listboxId"
      v-model="model"
      class="clv-listbox"
      :multiple="multiple"
      :name="name"
      :required="required"
      :disabled="disabled"
      :orientation="orientation"
      :selection-behavior="selectionBehavior"
    >
      <ListboxContent
        class="clv-listbox__content"
        :aria-labelledby="label ? labelId : undefined"
        :aria-describedby="descriptionId"
        :aria-invalid="error ? 'true' : undefined"
      >
        <p
          v-if="options.length === 0"
          class="clv-listbox__empty"
          role="option"
          aria-disabled="true"
        >
          {{ emptyText }}
        </p>
        <ListboxVirtualizer
          v-else-if="virtualize"
          :options="options"
          :estimate-size="estimateSize"
          :overscan="overscan"
          :text-content="(option) => option.label"
        >
          <template #default="{ option }">
            <ListboxItem
              class="clv-listbox__item"
              :value="option.value"
              :disabled="option.disabled"
              :aria-disabled="option.disabled || undefined"
            >
              <ListboxItemIndicator class="clv-listbox__indicator">✓</ListboxItemIndicator>
              <slot name="option" :option="option" :selected="selected(option.value)">
                <span>{{ option.label }}</span>
                <small v-if="option.description">{{ option.description }}</small>
              </slot>
            </ListboxItem>
          </template>
        </ListboxVirtualizer>
        <ListboxItem
          v-for="option in virtualize ? [] : options"
          :key="option.value"
          class="clv-listbox__item"
          :value="option.value"
          :disabled="option.disabled"
          :aria-disabled="option.disabled || undefined"
        >
          <ListboxItemIndicator class="clv-listbox__indicator">✓</ListboxItemIndicator>
          <slot name="option" :option="option" :selected="selected(option.value)">
            <span>{{ option.label }}</span>
            <small v-if="option.description">{{ option.description }}</small>
          </slot>
        </ListboxItem>
      </ListboxContent>
    </ListboxRoot>
    <span v-if="help || error" :id="descriptionId" :class="{ 'clv-listbox-field__error': error }">
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-listbox-field {
  @include field-stack;
  &__label {
    @include field-label;
  }
  &__error {
    color: var(--clv-color-danger);
  }
}
.clv-listbox {
  @include field;
  min-height: 5rem;
  padding: var(--clv-space-1);
  &:focus-visible {
    @include focus-ring;
  }
  &[data-disabled] {
    @include disabled;
  }
  &__content {
    max-height: 18rem;
    overflow: auto;
  }
  &__item {
    @include menu-item;
    position: relative;
    padding-left: 2rem;
  }
  &__item small {
    display: block;
    color: var(--clv-color-text-muted);
  }
  &__indicator {
    position: absolute;
    left: 0.65rem;
    color: var(--clv-color-primary);
  }
  &__empty {
    margin: 0;
    padding: var(--clv-space-4);
    color: var(--clv-color-text-muted);
  }
}
</style>
