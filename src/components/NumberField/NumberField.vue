<script setup lang="ts">
import { computed, useId } from 'vue'
import {
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
} from 'reka-ui'

const model = defineModel<number | null>()
const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    help?: string
    error?: string
    name?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    min?: number
    max?: number
    step?: number
    locale?: string
    formatOptions?: Intl.NumberFormatOptions
    disableWheelChange?: boolean
  }>(),
  {
    required: false,
    disabled: false,
    readonly: false,
    step: 1,
    locale: 'en-US',
    formatOptions: undefined,
    disableWheelChange: false,
  },
)
const emit = defineEmits<{ increment: []; decrement: [] }>()

const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() =>
  props.help || props.error ? `${inputId.value}-description` : undefined,
)
</script>

<template>
  <div class="clv-number-field">
    <label v-if="label" class="clv-number-field__label" :for="inputId">{{ label }}</label>
    <NumberFieldRoot
      v-model="model"
      class="clv-number-field__control"
      :id="inputId"
      :name="name"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :min="min"
      :max="max"
      :step="step"
      :locale="locale"
      :format-options="formatOptions"
      :disable-wheel-change="disableWheelChange"
    >
      <NumberFieldDecrement
        class="clv-number-field__button"
        aria-label="Decrease value"
        @click="emit('decrement')"
      >
        −
      </NumberFieldDecrement>
      <slot name="input" :value="model">
        <NumberFieldInput
          class="clv-number-field__input"
          :aria-invalid="error ? 'true' : undefined"
          :aria-describedby="descriptionId"
        />
      </slot>
      <NumberFieldIncrement
        class="clv-number-field__button"
        aria-label="Increase value"
        @click="emit('increment')"
      >
        +
      </NumberFieldIncrement>
    </NumberFieldRoot>
    <span v-if="help || error" :id="descriptionId" :class="{ 'clv-number-field__error': error }">
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-number-field {
  @include field-stack;
  &__label {
    @include field-label;
  }
  &__error {
    color: var(--clv-color-danger);
  }
  &__control {
    @include field;
    display: grid;
    grid-template-columns: auto minmax(4rem, 1fr) auto;
    overflow: hidden;
  }
  &__control:focus-within {
    @include focus-ring;
  }
  &__input {
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--clv-color-text);
    text-align: center;
    font: inherit;
  }
  &__button {
    width: 2.5rem;
    border: 0;
    background: var(--clv-color-surface);
    color: var(--clv-color-text);
    cursor: pointer;
    font-size: 1.15rem;
  }
  &__button:hover:not(:disabled) {
    background: var(--clv-color-surface-raised);
  }
  &__button:focus-visible {
    @include focus-ring;
    outline-offset: -3px;
  }
  &__button:disabled {
    @include disabled;
  }
}
</style>
