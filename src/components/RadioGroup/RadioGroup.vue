<script setup lang="ts">
import { computed, useId } from 'vue'
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'

import type { ChoiceOption, ClvValue } from '../../types'

const model = defineModel<ClvValue>()
const props = withDefaults(
  defineProps<{
    id?: string
    options: ChoiceOption[]
    label?: string
    help?: string
    error?: string
    orientation?: 'horizontal' | 'vertical'
    name?: string
    required?: boolean
    disabled?: boolean
  }>(),
  { orientation: 'vertical', required: false, disabled: false },
)

const generatedId = useId()
const groupId = computed(() => props.id ?? generatedId)
const labelId = computed(() => (props.label ? `${groupId.value}-label` : undefined))
const descriptionId = computed(() =>
  props.help || props.error ? `${groupId.value}-description` : undefined,
)
</script>

<template>
  <fieldset class="clv-radio-field">
    <legend v-if="label" :id="labelId" class="clv-radio-field__label">{{ label }}</legend>
    <RadioGroupRoot
      :id="groupId"
      v-model="model"
      class="clv-radio-group"
      :class="`clv-radio-group--${orientation}`"
      :orientation="orientation"
      :name="name"
      :required="required"
      :disabled="disabled"
      :aria-labelledby="labelId"
      :aria-describedby="descriptionId"
      :aria-invalid="error ? 'true' : undefined"
    >
      <label
        v-for="option in options"
        :key="option.value"
        class="clv-radio-group__option"
        :class="{ 'clv-radio-group__option--disabled': option.disabled }"
      >
        <RadioGroupItem
          class="clv-radio-group__item"
          :value="option.value"
          :disabled="option.disabled"
        >
          <RadioGroupIndicator class="clv-radio-group__indicator" />
        </RadioGroupItem>
        <span>
          <slot name="option" :option="option">{{ option.label }}</slot>
          <small v-if="option.description">{{ option.description }}</small>
        </span>
      </label>
    </RadioGroupRoot>
    <span v-if="help || error" :id="descriptionId" :class="{ 'clv-radio-field__error': error }">
      {{ error ?? help }}
    </span>
  </fieldset>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-radio-field {
  display: grid;
  padding: 0;
  border: 0;
  margin: 0;
  gap: var(--clv-space-2);
  color: var(--clv-color-text-muted);
  font-family: var(--clv-font-sans);
  font-size: 0.875rem;

  &__label {
    padding: 0;
    color: var(--clv-color-text);
    font-weight: 750;
  }

  &__error {
    color: var(--clv-color-danger);
  }
}

.clv-radio-group {
  display: flex;
  gap: var(--clv-space-3);

  &--vertical {
    flex-direction: column;
  }

  &__option {
    display: flex;
    align-items: flex-start;
    gap: var(--clv-space-3);
    color: var(--clv-color-text);
    cursor: pointer;
  }

  &__option--disabled {
    @include disabled;
  }

  &__option small {
    display: block;
    margin-top: var(--clv-space-1);
    color: var(--clv-color-text-muted);
  }

  &__item {
    display: inline-flex;
    width: 1.25rem;
    height: 1.25rem;
    align-items: center;
    justify-content: center;
    flex: none;
    border: 1px solid var(--clv-color-border);
    border-radius: 50%;
    background: var(--clv-color-bg);
    cursor: pointer;

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__indicator {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: var(--clv-color-primary);
  }
}
</style>
