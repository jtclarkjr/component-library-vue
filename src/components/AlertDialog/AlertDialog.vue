<script setup lang="ts">
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'reka-ui'

import Button from '../Button/Button.vue'

const open = defineModel<boolean>('open', { default: false })

withDefaults(
  defineProps<{
    title: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'danger'
    loading?: boolean
  }>(),
  {
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    size: 'md',
    variant: 'default',
    loading: false,
  },
)

const emit = defineEmits<{
  confirm: [event: MouseEvent]
  cancel: [event: MouseEvent]
}>()
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger v-if="$slots.trigger" as-child><slot name="trigger" /></AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay class="clv-alert-dialog__overlay" />
      <AlertDialogContent class="clv-alert-dialog" :class="`clv-alert-dialog--${size}`">
        <AlertDialogTitle class="clv-alert-dialog__title">{{ title }}</AlertDialogTitle>
        <AlertDialogDescription v-if="description" class="clv-alert-dialog__description">
          {{ description }}
        </AlertDialogDescription>
        <div v-if="$slots.default" class="clv-alert-dialog__body"><slot /></div>
        <footer class="clv-alert-dialog__footer">
          <slot name="footer">
            <AlertDialogCancel as-child>
              <Button variant="secondary" @click="emit('cancel', $event)">{{ cancelLabel }}</Button>
            </AlertDialogCancel>
            <AlertDialogAction as-child>
              <Button
                :variant="variant === 'danger' ? 'danger' : 'primary'"
                :loading="loading"
                @click="emit('confirm', $event)"
              >
                {{ confirmLabel }}
              </Button>
            </AlertDialogAction>
          </slot>
        </footer>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-alert-dialog__overlay {
  position: fixed;
  z-index: 1000;
  background: var(--clv-color-overlay);
  backdrop-filter: blur(5px);
  inset: 0;

  &[data-state='open'] {
    animation: clv-alert-overlay-in var(--clv-motion-medium) ease-out;
  }
}

.clv-alert-dialog {
  @include floating-surface;
  position: fixed;
  z-index: 1001;
  top: 50%;
  left: 50%;
  width: calc(100% - 2rem);
  max-height: calc(100vh - 2rem);
  overflow: auto;
  padding: var(--clv-space-6);
  font-family: var(--clv-font-sans);
  transform: translate(-50%, -50%);

  &[data-state='open'] {
    animation: clv-alert-content-in var(--clv-motion-medium) cubic-bezier(0.16, 1, 0.3, 1);
  }

  &--sm {
    max-width: 26rem;
  }

  &--md {
    max-width: 34rem;
  }

  &--lg {
    max-width: 46rem;
  }

  &__title {
    margin: 0;
    color: var(--clv-color-text);
    font-size: 1.25rem;
    font-weight: 800;
  }

  &__description {
    margin: var(--clv-space-2) 0 0;
    color: var(--clv-color-text-muted);
  }

  &__body {
    padding-top: var(--clv-space-4);
    color: var(--clv-color-text-muted);
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--clv-space-3);
    padding-top: var(--clv-space-6);
  }
}

@keyframes clv-alert-overlay-in {
  from {
    opacity: 0;
  }
}

@keyframes clv-alert-content-in {
  from {
    opacity: 0;
    transform: translate(-50%, -47%) scale(0.96);
  }
}

@media (prefers-reduced-motion: reduce) {
  .clv-alert-dialog,
  .clv-alert-dialog__overlay {
    animation: none !important;
  }
}
</style>
