<script setup lang="ts">
import { Toggle as TogglePrimitive } from 'reka-ui'

const model = defineModel<boolean>({ default: false })

withDefaults(
  defineProps<{
    variant?: 'default' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    ariaLabel?: string
  }>(),
  { variant: 'default', size: 'md', disabled: false },
)
</script>

<template>
  <TogglePrimitive
    v-model="model"
    class="clv-toggle"
    :class="[`clv-toggle--${variant}`, `clv-toggle--${size}`]"
    :disabled="disabled"
    :aria-label="ariaLabel"
  >
    <slot />
  </TogglePrimitive>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: var(--clv-radius-sm);
  background: transparent;
  color: var(--clv-color-text-muted);
  cursor: pointer;
  font-family: var(--clv-font-sans);
  font-weight: 750;
  transition: all var(--clv-motion-fast) ease;

  &:focus-visible {
    @include focus-ring;
  }

  &:disabled {
    @include disabled;
  }

  &[data-state='on'] {
    background: var(--clv-color-primary);
    color: #06231b;
  }

  &--outline {
    border-color: var(--clv-color-border);
  }

  &--sm {
    min-width: 2rem;
    min-height: 2rem;
    padding: 0.35rem 0.55rem;
  }

  &--md {
    min-width: 2.65rem;
    min-height: 2.65rem;
    padding: 0.55rem 0.75rem;
  }

  &--lg {
    min-width: 3.2rem;
    min-height: 3.2rem;
    padding: 0.7rem 0.95rem;
  }
}
</style>
