<script setup lang="ts">
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from 'reka-ui'

import type { ToastItem } from '../../types'

const items = defineModel<ToastItem[]>('items', { default: [] })

withDefaults(
  defineProps<{
    duration?: number
    label?: string
    viewportLabel?: string
    swipeDirection?: 'up' | 'right' | 'down' | 'left'
  }>(),
  {
    duration: 5000,
    label: 'Notification',
    viewportLabel: 'Notifications ({hotkey})',
    swipeDirection: 'right',
  },
)

const emit = defineEmits<{
  action: [item: ToastItem]
  dismiss: [item: ToastItem]
}>()

function dismiss(item: ToastItem) {
  if (!items.value.some((current) => current.id === item.id)) return
  items.value = items.value.filter((current) => current.id !== item.id)
  emit('dismiss', item)
}

function action(item: ToastItem) {
  emit('action', item)
  dismiss(item)
}
</script>

<template>
  <ToastProvider :duration="duration" :label="label" :swipe-direction="swipeDirection">
    <ToastRoot
      v-for="item in items"
      :key="item.id"
      :open="true"
      class="clv-toast"
      :class="`clv-toast--${item.variant ?? 'info'}`"
      :duration="item.duration ?? duration"
      @update:open="!$event && dismiss(item)"
    >
      <div class="clv-toast__content">
        <ToastTitle class="clv-toast__title">{{ item.title }}</ToastTitle>
        <ToastDescription v-if="item.description" class="clv-toast__description">
          {{ item.description }}
        </ToastDescription>
      </div>
      <ToastAction
        v-if="item.actionLabel"
        class="clv-toast__action"
        :alt-text="item.actionLabel"
        @click="action(item)"
      >
        {{ item.actionLabel }}
      </ToastAction>
      <ToastClose class="clv-toast__close" aria-label="Dismiss notification">×</ToastClose>
    </ToastRoot>
    <ToastPortal>
      <ToastViewport class="clv-toast-viewport" :label="viewportLabel" />
    </ToastPortal>
  </ToastProvider>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-toast-viewport {
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  display: flex;
  width: min(26rem, 100vw);
  max-height: 100vh;
  flex-direction: column;
  gap: var(--clv-space-3);
  padding: var(--clv-space-6);
  margin: 0;
  list-style: none;
  outline: none;
}

.clv-toast {
  @include floating-surface;
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: var(--clv-space-3);
  padding: var(--clv-space-4);
  border-left: 4px solid var(--clv-color-primary);
  font-family: var(--clv-font-sans);

  &[data-state='open'] {
    animation: clv-toast-in var(--clv-motion-medium) cubic-bezier(0.16, 1, 0.3, 1);
  }

  &[data-swipe='move'] {
    transform: translateX(var(--reka-toast-swipe-move-x));
  }

  &--success {
    border-left-color: var(--clv-color-success);
  }

  &--warning {
    border-left-color: var(--clv-color-warning);
  }

  &--danger {
    border-left-color: var(--clv-color-danger);
  }

  &__title {
    color: var(--clv-color-text);
    font-weight: 800;
  }

  &__description {
    margin-top: var(--clv-space-1);
    color: var(--clv-color-text-muted);
    font-size: 0.875rem;
  }

  &__action,
  &__close {
    border: 0;
    background: transparent;
    color: var(--clv-color-primary);
    cursor: pointer;
    font: inherit;
    font-weight: 750;
  }

  &__close {
    color: var(--clv-color-text-muted);
    font-size: 1.25rem;
  }

  &__action:focus-visible,
  &__close:focus-visible {
    @include focus-ring;
  }
}

@keyframes clv-toast-in {
  from {
    opacity: 0;
    transform: translateX(1rem);
  }
}
</style>
