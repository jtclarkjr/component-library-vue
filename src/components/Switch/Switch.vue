<script setup lang="ts">
import { computed, useId } from 'vue'
import { SwitchRoot, SwitchThumb } from 'reka-ui'

const model = defineModel<boolean>({ default: false })
const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    help?: string
    error?: string
    name?: string
    required?: boolean
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { required: false, disabled: false, size: 'md' },
)

const generatedId = useId()
const controlId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() =>
  props.help || props.error ? `${controlId.value}-description` : undefined,
)
</script>

<template>
  <div class="clv-switch-field">
    <div class="clv-switch-field__control">
      <SwitchRoot
        :id="controlId"
        v-model="model"
        class="clv-switch"
        :class="`clv-switch--${size}`"
        :name="name"
        :required="required"
        :disabled="disabled"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="descriptionId"
      >
        <SwitchThumb class="clv-switch__thumb" />
      </SwitchRoot>
      <label v-if="label || $slots.default" :for="controlId" class="clv-switch-field__label">
        <slot>{{ label }}</slot>
      </label>
    </div>
    <span v-if="help || error" :id="descriptionId" :class="{ 'clv-switch-field__error': error }">
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-switch-field {
  display: grid;
  gap: var(--clv-space-2);
  color: var(--clv-color-text-muted);
  font-family: var(--clv-font-sans);
  font-size: 0.875rem;

  &__control {
    display: flex;
    align-items: center;
    gap: var(--clv-space-3);
  }

  &__label {
    color: var(--clv-color-text);
    cursor: pointer;
    font-weight: 700;
  }

  &__error {
    color: var(--clv-color-danger);
  }
}

.clv-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex: none;
  border: 1px solid var(--clv-color-border);
  border-radius: 999px;
  background: var(--clv-color-surface-raised);
  cursor: pointer;
  transition: background var(--clv-motion-fast) ease;

  &:focus-visible {
    @include focus-ring;
  }

  &:disabled {
    @include disabled;
  }

  &[data-state='checked'] {
    border-color: var(--clv-color-primary);
    background: var(--clv-color-primary);
  }

  &--sm {
    width: 2.15rem;
    height: 1.25rem;
    padding: 0.12rem;
  }

  &--md {
    width: 2.75rem;
    height: 1.55rem;
    padding: 0.15rem;
  }

  &--lg {
    width: 3.35rem;
    height: 1.85rem;
    padding: 0.18rem;
  }

  &__thumb {
    display: block;
    aspect-ratio: 1;
    height: 100%;
    border-radius: 50%;
    background: var(--clv-color-text);
    box-shadow: var(--clv-shadow-sm);
    transform: translateX(0);
    transition: transform var(--clv-motion-fast) ease;
  }

  &--sm[data-state='checked'] &__thumb {
    transform: translateX(0.88rem);
  }

  &--md[data-state='checked'] &__thumb {
    transform: translateX(1.18rem);
  }

  &--lg[data-state='checked'] &__thumb {
    transform: translateX(1.45rem);
  }
}
</style>
