<script setup lang="ts">
import { computed, useId } from 'vue'
import { CheckboxIndicator, CheckboxRoot, type CheckboxCheckedState } from 'reka-ui'

const model = defineModel<CheckboxCheckedState>({ default: false })
const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    help?: string
    error?: string
    name?: string
    value?: string
    required?: boolean
    disabled?: boolean
  }>(),
  { required: false, disabled: false },
)

const generatedId = useId()
const controlId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() =>
  props.help || props.error ? `${controlId.value}-description` : undefined,
)
</script>

<template>
  <div class="clv-checkbox-field">
    <div class="clv-checkbox-field__control">
      <CheckboxRoot
        :id="controlId"
        v-model="model"
        class="clv-checkbox"
        :name="name"
        :value="value"
        :required="required"
        :disabled="disabled"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="descriptionId"
      >
        <CheckboxIndicator class="clv-checkbox__indicator">
          {{ model === 'indeterminate' ? '−' : '✓' }}
        </CheckboxIndicator>
      </CheckboxRoot>
      <label v-if="label || $slots.default" :for="controlId" class="clv-checkbox-field__label">
        <slot>{{ label }}</slot>
      </label>
    </div>
    <span v-if="help || error" :id="descriptionId" :class="{ 'clv-checkbox-field__error': error }">
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-checkbox-field {
  display: grid;
  gap: var(--clv-space-2);
  color: var(--clv-color-text-muted);
  font-family: var(--clv-font-sans);
  font-size: 0.875rem;

  &__control {
    display: flex;
    align-items: flex-start;
    gap: var(--clv-space-3);
  }

  &__label {
    padding-top: 0.15rem;
    color: var(--clv-color-text);
    cursor: pointer;
    font-weight: 700;
  }

  &__error {
    color: var(--clv-color-danger);
  }
}

.clv-checkbox {
  display: inline-flex;
  width: 1.35rem;
  height: 1.35rem;
  align-items: center;
  justify-content: center;
  flex: none;
  border: 1px solid var(--clv-color-border);
  border-radius: 0.35rem;
  background: var(--clv-color-bg);
  color: #06231b;
  cursor: pointer;

  &:focus-visible {
    @include focus-ring;
  }

  &:disabled {
    @include disabled;
  }

  &[data-state='checked'],
  &[data-state='indeterminate'] {
    border-color: var(--clv-color-primary);
    background: var(--clv-color-primary);
  }

  &__indicator {
    font-size: 0.9rem;
    font-weight: 900;
    line-height: 1;
  }
}
</style>
