<script setup lang="ts">
import { computed } from 'vue'
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'

const props = withDefaults(
  defineProps<{
    src?: string
    alt: string
    fallback?: string
    size?: 'sm' | 'md' | 'lg'
    shape?: 'circle' | 'rounded'
  }>(),
  { size: 'md', shape: 'circle' },
)

const emit = defineEmits<{
  loadingStatusChange: [status: 'idle' | 'loading' | 'loaded' | 'error']
}>()

const fallbackText = computed(() => props.fallback ?? props.alt.trim().charAt(0).toUpperCase())
</script>

<template>
  <AvatarRoot class="clv-avatar" :class="[`clv-avatar--${size}`, `clv-avatar--${shape}`]">
    <AvatarImage
      v-if="src"
      class="clv-avatar__image"
      :src="src"
      :alt="alt"
      @loading-status-change="emit('loadingStatusChange', $event)"
    />
    <AvatarFallback class="clv-avatar__fallback">
      <slot name="fallback">{{ fallbackText }}</slot>
    </AvatarFallback>
  </AvatarRoot>
</template>

<style scoped lang="scss">
.clv-avatar {
  display: inline-flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  flex: none;
  border: 1px solid var(--clv-color-border);
  background: var(--clv-color-surface-raised);
  color: var(--clv-color-text);
  font-family: var(--clv-font-sans);
  font-weight: 800;

  &--sm {
    width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
  }

  &--md {
    width: 2.75rem;
    height: 2.75rem;
  }

  &--lg {
    width: 4rem;
    height: 4rem;
    font-size: 1.25rem;
  }

  &--circle {
    border-radius: 50%;
  }

  &--rounded {
    border-radius: var(--clv-radius-md);
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__fallback {
    display: inline-flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
}
</style>
