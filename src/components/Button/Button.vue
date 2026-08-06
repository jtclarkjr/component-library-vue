<script setup lang="ts">
import { computed, toRef, useAttrs } from 'vue'
import { Primitive } from 'reka-ui'

import { useClvComponent } from '../../headless'
import type { ButtonPartContext, ButtonParts } from '../../parts'
import type { ButtonAs, ButtonSize, ButtonVariant } from '../../types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    as?: ButtonAs
    variant?: ButtonVariant
    size?: ButtonSize
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    unstyled?: boolean
    parts?: ButtonParts
  }>(),
  {
    as: 'button',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    type: 'button',
    unstyled: undefined,
    parts: undefined,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const attrs = useAttrs()
const clv = useClvComponent<ButtonPartContext>('button', {
  attrs,
  parts: toRef(props, 'parts'),
  unstyled: toRef(props, 'unstyled'),
})
const unavailable = computed(() => props.disabled || props.loading)
const context = computed(() => ({
  disabled: unavailable.value,
  loading: props.loading,
  size: props.size,
  variant: props.variant,
}))

function handleClick(event: MouseEvent) {
  if (unavailable.value) {
    event.preventDefault()
    event.stopImmediatePropagation()
    return
  }

  emit('click', event)
}

const rootAttrs = computed(() =>
  clv.part(
    'root',
    context.value,
    {
      as: props.as,
      class: ['clv-button', `clv-button--${props.variant}`, `clv-button--${props.size}`],
      'aria-busy': props.loading || undefined,
      'aria-disabled': props.as !== 'button' && unavailable.value ? 'true' : undefined,
      'data-disabled': unavailable.value ? '' : undefined,
      'data-loading': props.loading ? '' : undefined,
      'data-size': props.size,
      'data-variant': props.variant,
      disabled: props.as === 'button' ? unavailable.value : undefined,
      onClick: handleClick,
      tabindex: props.as !== 'button' && unavailable.value ? -1 : undefined,
      type: props.as === 'button' ? props.type : undefined,
    },
    {
      protected: [
        'as',
        'aria-busy',
        'aria-disabled',
        'data-disabled',
        'data-loading',
        'data-size',
        'data-variant',
        'disabled',
        'tabindex',
        'type',
      ],
    },
  ),
)
const loaderAttrs = computed(() =>
  clv.part(
    'loader',
    context.value,
    {
      class: ['clv-spinner', 'clv-spinner--sm'],
      'aria-hidden': true,
      'data-loading': '',
      'data-size': 'sm',
    },
    {
      surface: true,
      protected: ['aria-hidden', 'data-loading', 'data-size'],
    },
  ),
)
</script>

<template>
  <Primitive v-bind="rootAttrs">
    <slot v-if="loading" name="loader" :context="clv.slotContext('loader', context)">
      <span v-bind="loaderAttrs" />
    </slot>
    <slot :context="clv.slotContext('root', context)" />
  </Primitive>
</template>

<style scoped lang="scss">
@layer clv.components {
  .clv-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--clv-space-2);
    border: 1px solid transparent;
    border-radius: var(--clv-radius-sm);
    font-family: var(--clv-font-sans);
    font-weight: var(--clv-button-font-weight, 750);
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    transition:
      background-color var(--clv-motion-fast) ease,
      border-color var(--clv-motion-fast) ease,
      color var(--clv-motion-fast) ease,
      opacity var(--clv-motion-fast) ease;

    &:focus-visible {
      outline: 3px solid var(--clv-color-focus);
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

    &--icon {
      width: var(--clv-button-icon-size, 3rem);
      height: var(--clv-button-icon-size, 3rem);
      min-height: var(--clv-button-icon-size, 3rem);
      padding: 0;
      border-radius: 50%;
    }

    &--primary {
      background: var(--clv-color-primary);
      color: var(--clv-color-on-primary);

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

    &--surface {
      border-color: var(--clv-color-border);
      background: var(--clv-button-surface-bg, var(--clv-color-surface));
      box-shadow: var(--clv-button-surface-shadow, var(--clv-shadow-sm));
      color: var(--clv-color-text);
      backdrop-filter: var(--clv-button-surface-backdrop, none);

      &:hover:not(:disabled, [aria-disabled='true']) {
        border-color: var(--clv-color-primary);
        background: var(--clv-button-surface-hover, var(--clv-color-surface-raised));
      }
    }

    &--ghost {
      background: transparent;
      color: var(--clv-color-text-muted);

      &:hover:not(:disabled, [aria-disabled='true']) {
        background: var(--clv-color-selection);
        color: var(--clv-color-text);
      }
    }

    &--danger {
      background: var(--clv-color-danger);
      color: var(--clv-color-on-danger);

      &:hover:not(:disabled, [aria-disabled='true']) {
        background: var(--clv-color-danger-hover);
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .clv-button {
      transition: none;
    }
  }
}
</style>
