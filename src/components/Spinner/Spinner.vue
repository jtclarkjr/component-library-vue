<script setup lang="ts">
import { computed, toRef, useAttrs } from 'vue'

import { useClvComponent } from '../../headless'
import type { SpinnerPartContext, SpinnerParts } from '../../parts'
import type { SpinnerSize } from '../../types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    size?: SpinnerSize
    label?: string
    decorative?: boolean
    unstyled?: boolean
    parts?: SpinnerParts
  }>(),
  {
    size: 'md',
    label: 'Loading',
    decorative: false,
    unstyled: undefined,
    parts: undefined,
  },
)

const attrs = useAttrs()
const clv = useClvComponent<SpinnerPartContext>('spinner', {
  attrs,
  parts: toRef(props, 'parts'),
  unstyled: toRef(props, 'unstyled'),
})
const context = computed(() => ({ loading: true, size: props.size }))
const rootAttrs = computed(() =>
  clv.part(
    'root',
    context.value,
    {
      class: ['clv-spinner', `clv-spinner--${props.size}`],
      'aria-hidden': props.decorative || undefined,
      'aria-label': props.decorative ? undefined : props.label,
      'data-loading': '',
      'data-size': props.size,
      role: props.decorative ? undefined : 'status',
    },
    {
      protected: ['aria-hidden', 'aria-label', 'data-loading', 'data-size', 'role'],
    },
  ),
)
</script>

<template>
  <span v-bind="rootAttrs" />
</template>

<style lang="scss">
@layer clv.components {
  .clv-spinner {
    display: inline-block;
    flex-shrink: 0;
    border: var(--clv-spinner-border-width, 2px) solid var(--clv-spinner-track-color, currentcolor);
    border-top-color: var(--clv-spinner-accent-color, transparent);
    border-radius: 50%;
    animation: clv-spinner-spin var(--clv-spinner-duration, 650ms) linear infinite;

    &--sm {
      width: var(--clv-spinner-size-sm, 0.9rem);
      height: var(--clv-spinner-size-sm, 0.9rem);
      border-width: var(--clv-spinner-border-sm, var(--clv-spinner-border-width, 2px));
    }

    &--md {
      width: var(--clv-spinner-size-md, 1.25rem);
      height: var(--clv-spinner-size-md, 1.25rem);
      border-width: var(--clv-spinner-border-md, var(--clv-spinner-border-width, 2px));
    }

    &--lg {
      width: var(--clv-spinner-size-lg, 2rem);
      height: var(--clv-spinner-size-lg, 2rem);
      border-width: var(--clv-spinner-border-lg, var(--clv-spinner-border-width, 2px));
    }

    &--xl {
      width: var(--clv-spinner-size-xl, 3rem);
      height: var(--clv-spinner-size-xl, 3rem);
      border-width: var(--clv-spinner-border-xl, var(--clv-spinner-border-width, 3px));
    }
  }

  @keyframes clv-spinner-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .clv-spinner {
      animation-duration: var(--clv-spinner-reduced-duration, 1.5s);
    }
  }
}
</style>
