<script setup lang="ts">
import { Toggle as TogglePrimitive } from 'reka-ui'
import { useClvComponent } from '../../headless'
import type { TogglePartContext, ToggleParts } from '../../parts'

const model = defineModel<boolean>({ default: false })

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    ariaLabel?: string
    unstyled?: boolean
    parts?: ToggleParts
  }>(),
  { variant: 'default', size: 'md', disabled: false },
)

const { classes, part, slotContext } = useClvComponent<TogglePartContext>('toggle', props)
</script>

<template>
  <TogglePrimitive
    v-model="model"
    :class="classes(['clv-toggle', `clv-toggle--${variant}`, `clv-toggle--${size}`])"
    v-bind="part('root', { disabled, pressed: model, size, variant })"
    :disabled="disabled"
    :aria-label="ariaLabel"
  >
    <slot :context="slotContext('root', { disabled, pressed: model, size, variant })" />
  </TogglePrimitive>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: var(--clv-border-width) solid transparent;
    border-radius: var(--clv-radius-sm);
    background: transparent;
    color: var(--clv-color-text-muted);
    cursor: pointer;
    font-family: var(--clv-font-sans);
    font-weight: var(--clv-font-weight-strong);
    transition: all var(--clv-motion-fast) var(--clv-motion-easing-standard);

    &:focus-visible {
      @include focus-ring;
    }

    &:disabled {
      @include disabled;
    }

    &[data-state='on'] {
      background: var(--clv-color-primary);
      color: var(--clv-choice-selected-text);
    }

    &--outline {
      border-color: var(--clv-color-border);
    }

    &--sm {
      min-width: 2rem;
      min-height: 2rem;
      padding: var(--clv-toggle-padding-sm);
    }

    &--md {
      min-width: 2.65rem;
      min-height: 2.65rem;
      padding: var(--clv-toggle-padding-md);
    }

    &--lg {
      min-width: 3.2rem;
      min-height: 3.2rem;
      padding: var(--clv-toggle-padding-lg);
    }
  }
}
</style>
