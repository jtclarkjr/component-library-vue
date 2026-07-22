<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'

import Button from '../Button/Button.vue'

const open = defineModel<boolean>('open', { default: false })

withDefaults(
  defineProps<{
    title: string
    description?: string
    size?: 'sm' | 'md' | 'lg'
    closeLabel?: string
  }>(),
  { size: 'md', closeLabel: 'Close dialog' },
)
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger v-if="$slots.trigger" as-child><slot name="trigger" /></DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="clv-dialog__overlay" />
      <DialogContent class="clv-dialog" :class="`clv-dialog--${size}`">
        <header class="clv-dialog__header">
          <div>
            <DialogTitle class="clv-dialog__title">{{ title }}</DialogTitle>
            <DialogDescription v-if="description" class="clv-dialog__description">
              {{ description }}
            </DialogDescription>
          </div>
          <DialogClose as-child>
            <Button :aria-label="closeLabel" size="sm" variant="ghost">×</Button>
          </DialogClose>
        </header>
        <div class="clv-dialog__body"><slot /></div>
        <footer v-if="$slots.footer" class="clv-dialog__footer"><slot name="footer" /></footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped lang="scss">
.clv-dialog__overlay {
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgb(2 7 15 / 72%);
  backdrop-filter: blur(5px);

  &[data-state='open'] {
    animation: clv-dialog-overlay-in 200ms ease-out both;
  }

  &[data-state='closed'] {
    animation: clv-dialog-overlay-out 160ms ease-in both;
  }
}

.clv-dialog {
  position: fixed;
  z-index: 1001;
  top: 50%;
  left: 50%;
  width: calc(100% - 2rem);
  max-height: calc(100vh - 2rem);
  overflow: auto;
  padding: var(--clv-space-6);
  border: 1px solid var(--clv-color-border);
  border-radius: var(--clv-radius-lg);
  background: var(--clv-color-surface);
  box-shadow: var(--clv-shadow-lg);
  color: var(--clv-color-text);
  font-family: var(--clv-font-sans);
  transform: translate(-50%, -50%);
  transform-origin: center;
  will-change: opacity, transform;

  &[data-state='open'] {
    animation: clv-dialog-content-in 240ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  &[data-state='closed'] {
    animation: clv-dialog-content-out 160ms ease-in both;
  }

  &--sm {
    max-width: 28rem;
  }

  &--md {
    max-width: 38rem;
  }

  &--lg {
    max-width: 54rem;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--clv-space-4);
  }

  &__title {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 800;
  }

  &__description {
    margin: var(--clv-space-2) 0 0;
    color: var(--clv-color-text-muted);
  }

  &__body {
    padding-block: var(--clv-space-6);
    color: var(--clv-color-text-muted);
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--clv-space-3);
  }
}

@keyframes clv-dialog-overlay-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes clv-dialog-overlay-out {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@keyframes clv-dialog-content-in {
  from {
    opacity: 0;
    transform: translate(-50%, -47%) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes clv-dialog-content-out {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  to {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.97);
  }
}

@media (prefers-reduced-motion: reduce) {
  .clv-dialog,
  .clv-dialog__overlay {
    animation: none !important;
  }
}
</style>
