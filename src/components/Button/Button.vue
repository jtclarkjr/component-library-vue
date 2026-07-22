<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'reka-ui'

import Spinner from '../Spinner/Spinner.vue'

const props = withDefaults(
  defineProps<{
    as?: PrimitiveProps['as']
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    as: 'button',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    type: 'button',
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }

  emit('click', event)
}
</script>

<template>
  <Primitive
    :as="as"
    class="clv-button"
    :class="[`clv-button--${variant}`, `clv-button--${size}`]"
    :aria-busy="loading || undefined"
    :aria-disabled="as !== 'button' && (disabled || loading) ? 'true' : undefined"
    :disabled="as === 'button' ? disabled || loading : undefined"
    :type="as === 'button' ? type : undefined"
    @click="handleClick"
  >
    <Spinner v-if="loading" decorative size="sm" />
    <slot />
  </Primitive>
</template>

<style scoped lang="scss">
.clv-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--clv-space-2);
  border: 1px solid transparent;
  border-radius: var(--clv-radius-sm);
  font-family: var(--clv-font-sans);
  font-weight: 750;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    color 140ms ease,
    opacity 140ms ease;

  &:focus-visible {
    outline: 3px solid rgb(116 224 193 / 35%);
    outline-offset: 2px;
  }

  &:disabled,
  &[aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.55;
  }

  &--sm {
    min-height: 2rem;
    padding: 0.45rem 0.7rem;
    font-size: 0.82rem;
  }

  &--md {
    min-height: 2.65rem;
    padding: 0.7rem 1rem;
  }

  &--lg {
    min-height: 3.2rem;
    padding: 0.9rem 1.3rem;
    font-size: 1.08rem;
  }

  &--primary {
    background: var(--clv-color-primary);
    color: #06231b;

    &:hover:not(:disabled, [aria-disabled='true']) {
      background: var(--clv-color-primary-hover);
    }
  }

  &--secondary {
    border-color: var(--clv-color-border);
    background: var(--clv-color-surface);
    color: var(--clv-color-text);

    &:hover:not(:disabled, [aria-disabled='true']) {
      background: var(--clv-color-surface-raised);
    }
  }

  &--ghost {
    background: transparent;
    color: var(--clv-color-text-muted);

    &:hover:not(:disabled, [aria-disabled='true']) {
      background: rgb(255 255 255 / 7%);
      color: var(--clv-color-text);
    }
  }

  &--danger {
    background: var(--clv-color-danger);
    color: #2c0710;
  }
}
</style>
