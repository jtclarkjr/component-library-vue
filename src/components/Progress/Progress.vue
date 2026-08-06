<script setup lang="ts">
import { computed } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { useClvComponent } from '../../headless'
import type { ProgressPartContext, ProgressParts } from '../../parts'

const props = withDefaults(
  defineProps<{
    value?: number | null
    max?: number
    label?: string
    showValue?: boolean
    size?: 'sm' | 'md' | 'lg'
    variant?: 'primary' | 'success' | 'danger'
    unstyled?: boolean
    parts?: ProgressParts
  }>(),
  { value: null, max: 100, label: 'Progress', showValue: false, size: 'md', variant: 'primary' },
)
const { classes, part, slotContext } = useClvComponent<ProgressPartContext>('progress', props)

const percentage = computed(() =>
  props.value === null ? 0 : Math.min(100, Math.max(0, (props.value / props.max) * 100)),
)
</script>

<template>
  <div
    :class="classes('clv-progress-field')"
    v-bind="part('root', { size, variant, loading: value === null })"
  >
    <div
      v-if="showValue"
      :class="classes('clv-progress-field__label')"
      v-bind="part('label', { size, variant, loading: value === null })"
    >
      <slot
        name="label"
        :context="slotContext('label', { size, variant, loading: value === null })"
        >{{ label }}</slot
      >
      <slot
        name="value"
        :value="value"
        :percentage="percentage"
        :context="slotContext('value', { size, variant, loading: value === null })"
      >
        <span v-bind="part('value', { size, variant, loading: value === null })">{{
          value === null ? 'Loading' : `${Math.round(percentage)}%`
        }}</span>
      </slot>
    </div>
    <ProgressRoot
      :class="classes(['clv-progress', `clv-progress--${size}`, `clv-progress--${variant}`])"
      :model-value="value"
      :max="max"
      :aria-label="label"
      v-bind="part('track', { size, variant, loading: value === null })"
    >
      <ProgressIndicator
        :class="classes('clv-progress__indicator')"
        :style="{ transform: `translateX(-${100 - percentage}%)` }"
        v-bind="part('indicator', { size, variant, loading: value === null })"
      />
    </ProgressRoot>
  </div>
</template>

<style scoped lang="scss">
@layer clv.components {
  .clv-progress-field {
    display: grid;
    width: 100%;
    gap: var(--clv-space-2);
    font-family: var(--clv-font-sans);

    &__label {
      display: flex;
      justify-content: space-between;
      color: var(--clv-color-text-muted);
      font-size: 0.82rem;
    }
  }

  .clv-progress {
    overflow: hidden;
    width: 100%;
    border-radius: 999px;
    background: var(--clv-color-surface-raised);

    &--sm {
      height: 0.35rem;
    }

    &--md {
      height: 0.6rem;
    }

    &--lg {
      height: 0.9rem;
    }

    &__indicator {
      width: 100%;
      height: 100%;
      background: var(--clv-color-primary);
      transition: transform var(--clv-motion-medium) ease;
    }

    &--success &__indicator {
      background: var(--clv-color-success);
    }

    &--danger &__indicator {
      background: var(--clv-color-danger);
    }

    &[data-state='indeterminate'] &__indicator {
      width: 45%;
      animation: clv-progress-indeterminate 1.2s ease-in-out infinite;
    }
  }

  @keyframes clv-progress-indeterminate {
    0% {
      transform: translateX(-110%) !important;
    }

    100% {
      transform: translateX(230%) !important;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .clv-progress__indicator {
      animation: none !important;
      transition: none;
    }
  }
}
</style>
