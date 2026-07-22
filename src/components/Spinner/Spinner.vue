<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    label?: string
    decorative?: boolean
  }>(),
  {
    size: 'md',
    label: 'Loading',
    decorative: false,
  },
)
</script>

<template>
  <span
    class="clv-spinner"
    :class="`clv-spinner--${size}`"
    :aria-hidden="decorative || undefined"
    :aria-label="decorative ? undefined : label"
    :role="decorative ? undefined : 'status'"
  />
</template>

<style scoped lang="scss">
.clv-spinner {
  display: inline-block;
  border: 2px solid currentcolor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: clv-spinner-spin 650ms linear infinite;

  &--sm {
    width: 0.9rem;
    height: 0.9rem;
  }

  &--md {
    width: 1.25rem;
    height: 1.25rem;
  }

  &--lg {
    width: 2rem;
    height: 2rem;
  }
}

@keyframes clv-spinner-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .clv-spinner {
    animation-duration: 1.5s;
  }
}
</style>
