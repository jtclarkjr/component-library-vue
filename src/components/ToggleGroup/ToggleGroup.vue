<script setup lang="ts">
import { computed, useId } from 'vue'
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'

import type { ChoiceOption, ClvValue } from '../../types'

const model = defineModel<ClvValue | ClvValue[]>()
const props = withDefaults(
  defineProps<{
    id?: string
    options: ChoiceOption[]
    type?: 'single' | 'multiple'
    label?: string
    name?: string
    required?: boolean
    disabled?: boolean
    orientation?: 'horizontal' | 'vertical'
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'outline'
    loop?: boolean
  }>(),
  {
    type: 'single',
    required: false,
    disabled: false,
    orientation: 'horizontal',
    size: 'md',
    variant: 'default',
    loop: true,
  },
)

const generatedId = useId()
const groupId = computed(() => props.id ?? generatedId)
const labelId = computed(() => `${groupId.value}-label`)
function selected(value: ClvValue) {
  return Array.isArray(model.value) ? model.value.includes(value) : model.value === value
}
</script>

<template>
  <div class="clv-toggle-group-field">
    <span v-if="label" :id="labelId" class="clv-toggle-group-field__label">{{ label }}</span>
    <ToggleGroupRoot
      :id="groupId"
      v-model="model"
      class="clv-toggle-group"
      :class="[
        `clv-toggle-group--${orientation}`,
        `clv-toggle-group--${size}`,
        `clv-toggle-group--${variant}`,
      ]"
      :type="type"
      :name="name"
      :required="required"
      :disabled="disabled"
      :orientation="orientation"
      :loop="loop"
      :aria-labelledby="label ? labelId : undefined"
    >
      <ToggleGroupItem
        v-for="option in options"
        :key="option.value"
        class="clv-toggle-group__item"
        :value="option.value"
        :disabled="option.disabled"
        :aria-label="option.label"
      >
        <slot name="option" :option="option" :selected="selected(option.value)">{{
          option.label
        }}</slot>
      </ToggleGroupItem>
    </ToggleGroupRoot>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-toggle-group-field {
  @include field-stack;
  &__label {
    @include field-label;
  }
}
.clv-toggle-group {
  display: inline-flex;
  width: fit-content;
  gap: var(--clv-space-1);
  &--vertical {
    flex-direction: column;
  }
  &__item {
    border: 1px solid transparent;
    border-radius: var(--clv-radius-sm);
    background: var(--clv-color-surface);
    color: var(--clv-color-text-muted);
    cursor: pointer;
    font: inherit;
  }
  &--sm &__item {
    padding: 0.35rem 0.55rem;
    font-size: 0.75rem;
  }
  &--md &__item {
    padding: 0.55rem 0.75rem;
    font-size: 0.875rem;
  }
  &--lg &__item {
    padding: 0.7rem 0.95rem;
    font-size: 1rem;
  }
  &--outline &__item {
    border-color: var(--clv-color-border);
    background: transparent;
  }
  &__item[data-state='on'] {
    border-color: var(--clv-color-primary);
    background: var(--clv-color-selection);
    color: var(--clv-color-primary);
  }
  &__item:focus-visible {
    @include focus-ring;
  }
  &__item[data-disabled] {
    @include disabled;
  }
}
</style>
