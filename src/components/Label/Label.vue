<script setup lang="ts">
import { Label as RekaLabel } from 'reka-ui'
import { useClvComponent } from '../../headless'
import type { LabelPartContext, LabelParts } from '../../parts'

const props = withDefaults(
  defineProps<{
    for?: string
    required?: boolean
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg'
    unstyled?: boolean
    parts?: LabelParts
  }>(),
  { required: false, disabled: false, size: 'md' },
)

const { classes, part, slotContext } = useClvComponent<LabelPartContext>('label', props)
</script>

<template>
  <RekaLabel
    :class="classes(['clv-label', `clv-label--${size}`, { 'clv-label--disabled': disabled }])"
    :for="props.for"
    v-bind="part('root', { required, disabled, size })"
  >
    <slot :context="slotContext('root', { required, disabled, size })" />
    <span
      v-if="required"
      :class="classes('clv-label__required')"
      aria-hidden="true"
      v-bind="part('required', { disabled, size })"
      >*</span
    >
  </RekaLabel>
</template>

<style scoped lang="scss">
@layer clv.components {
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
}
</style>
