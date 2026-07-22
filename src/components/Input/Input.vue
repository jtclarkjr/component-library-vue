<script setup lang="ts">
import { computed, useId } from 'vue'

const model = defineModel<string>({ default: '' })
const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    help?: string
    error?: string
    type?: 'text' | 'email' | 'password' | 'search' | 'url'
    placeholder?: string
    disabled?: boolean
    required?: boolean
  }>(),
  { type: 'text', disabled: false, required: false },
)

const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() =>
  props.help || props.error ? `${inputId.value}-description` : undefined,
)
</script>

<template>
  <div class="clv-input">
    <label v-if="label" class="clv-input__label" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="descriptionId"
    />
    <span v-if="help || error" :id="descriptionId" :class="{ 'clv-input__error': error }">
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.clv-input {
  display: grid;
  gap: var(--clv-space-2);
  color: var(--clv-color-text-muted);
  font-family: var(--clv-font-sans);
  font-size: 0.875rem;

  input {
    width: 100%;
    min-height: 2.65rem;
    padding: 0.65rem 0.8rem;
    border: 1px solid var(--clv-color-border);
    border-radius: var(--clv-radius-sm);
    background: var(--clv-color-bg);
    color: var(--clv-color-text);
    font: inherit;

    &:focus-visible {
      border-color: var(--clv-color-primary);
      outline: 2px solid rgb(116 224 193 / 20%);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }
  }

  &__label {
    color: var(--clv-color-text);
    font-weight: 700;
  }

  &__error {
    color: var(--clv-color-danger);
  }
}
</style>
