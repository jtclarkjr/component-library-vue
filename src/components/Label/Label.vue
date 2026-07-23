<script setup lang="ts">
import { Label as RekaLabel } from 'reka-ui'

const props = withDefaults(
  defineProps<{
    for?: string
    required?: boolean
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { required: false, disabled: false, size: 'md' },
)
</script>

<template>
  <RekaLabel
    class="clv-label"
    :class="[`clv-label--${size}`, { 'clv-label--disabled': disabled }]"
    :for="props.for"
  >
    <slot />
    <span v-if="required" class="clv-label__required" aria-hidden="true">*</span>
  </RekaLabel>
</template>

<style scoped lang="scss">
.clv-label {
  display: inline-flex;
  align-items: center;
  gap: var(--clv-space-1);
  color: var(--clv-color-text);
  font-family: var(--clv-font-sans);
  font-weight: 750;
  &--sm {
    font-size: 0.75rem;
  }
  &--md {
    font-size: 0.875rem;
  }
  &--lg {
    font-size: 1rem;
  }
  &--disabled {
    opacity: 0.55;
  }
  &__required {
    color: var(--clv-color-danger);
  }
}
</style>
