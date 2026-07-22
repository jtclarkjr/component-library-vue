<script setup lang="ts">
import { computed } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'

const props = withDefaults(
  defineProps<{
    value?: number | null
    max?: number
    label?: string
    showValue?: boolean
    size?: 'sm' | 'md' | 'lg'
    variant?: 'primary' | 'success' | 'danger'
  }>(),
  { value: null, max: 100, label: 'Progress', showValue: false, size: 'md', variant: 'primary' },
)

const percentage = computed(() =>
  props.value === null ? 0 : Math.min(100, Math.max(0, (props.value / props.max) * 100)),
)
</script>

<template>
  <div class="clv-progress-field">
    <div v-if="showValue" class="clv-progress-field__label">
      <slot name="label">{{ label }}</slot>
      <slot name="value" :value="value" :percentage="percentage">
        <span>{{ value === null ? 'Loading' : `${Math.round(percentage)}%` }}</span>
      </slot>
    </div>
    <ProgressRoot
      class="clv-progress"
      :class="[`clv-progress--${size}`, `clv-progress--${variant}`]"
      :model-value="value"
      :max="max"
      :aria-label="label"
    >
      <ProgressIndicator
        class="clv-progress__indicator"
        :style="{ transform: `translateX(-${100 - percentage}%)` }"
      />
    </ProgressRoot>
  </div>
</template>

<style scoped lang="scss">
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
</style>
