<script setup lang="ts">
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from 'reka-ui'

const open = defineModel<boolean>('open', { default: false })
const snapPoint = defineModel<number | string | null>('snapPoint', { default: null })
withDefaults(
  defineProps<{
    title: string
    description?: string
    modal?: boolean | 'trap-focus'
    direction?: 'down' | 'up' | 'left' | 'right'
    snapPoints?: Array<number | string>
    snapToSequentialPoints?: boolean
    showHandle?: boolean
    closeLabel?: string
  }>(),
  {
    description: undefined,
    modal: true,
    direction: 'down',
    snapPoints: undefined,
    snapToSequentialPoints: false,
    showHandle: true,
    closeLabel: 'Close',
  },
)
const emit = defineEmits<{ openComplete: [open: boolean] }>()
function close() {
  open.value = false
}
</script>

<template>
  <DrawerRoot
    v-model:open="open"
    v-model:snap-point="snapPoint"
    :modal="modal"
    :swipe-direction="direction"
    :snap-points="snapPoints"
    :snap-to-sequential-points="snapToSequentialPoints"
    @update:open-complete="emit('openComplete', $event)"
  >
    <DrawerTrigger as-child><slot name="trigger" /></DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay v-if="modal === true" class="clv-drawer__overlay" />
      <DrawerContent class="clv-drawer" :class="`clv-drawer--${direction}`">
        <slot name="handle" :close="close">
          <DrawerHandle v-if="showHandle" class="clv-drawer__handle" />
        </slot>
        <header class="clv-drawer__header">
          <div>
            <DrawerTitle class="clv-drawer__title">{{ title }}</DrawerTitle>
            <DrawerDescription v-if="description" class="clv-drawer__description">
              {{ description }}
            </DrawerDescription>
          </div>
          <DrawerClose class="clv-drawer__close" :aria-label="closeLabel">×</DrawerClose>
        </header>
        <div class="clv-drawer__body">
          <slot name="body" :close="close"><slot :close="close" /></slot>
        </div>
        <footer v-if="$slots.footer" class="clv-drawer__footer">
          <slot name="footer" :close="close" />
        </footer>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;
.clv-drawer__overlay {
  position: fixed;
  z-index: 1090;
  inset: 0;
  background: var(--clv-color-overlay);
}
.clv-drawer {
  @include floating-surface;
  position: fixed;
  z-index: 1100;
  display: flex;
  max-height: 92vh;
  flex-direction: column;
  border-radius: var(--clv-radius-lg);
  font-family: var(--clv-font-sans);
  &[data-state='open'] {
    animation: clv-drawer-in var(--clv-motion-medium) ease-out;
  }
  @include reduced-motion;
}
.clv-drawer--down {
  right: 0;
  bottom: 0;
  left: 0;
  max-height: 92vh;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.clv-drawer--up {
  top: 0;
  right: 0;
  left: 0;
  max-height: 92vh;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.clv-drawer--left {
  top: 0;
  bottom: 0;
  left: 0;
  width: var(--clv-drawer-size);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.clv-drawer--right {
  top: 0;
  right: 0;
  bottom: 0;
  width: var(--clv-drawer-size);
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.clv-drawer__handle {
  width: 3rem;
  height: 0.3rem;
  margin: var(--clv-space-2) auto;
  border-radius: 999px;
  background: var(--clv-color-border);
}
.clv-drawer__header,
.clv-drawer__footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--clv-space-4);
  padding: var(--clv-space-4);
  border-bottom: 1px solid var(--clv-color-border);
}
.clv-drawer__footer {
  border-top: 1px solid var(--clv-color-border);
  border-bottom: 0;
}
.clv-drawer__title {
  margin: 0;
  color: var(--clv-color-text);
  font-size: 1.1rem;
  font-weight: 850;
}
.clv-drawer__description {
  margin-top: var(--clv-space-1);
  color: var(--clv-color-text-muted);
}
.clv-drawer__close {
  border: 0;
  background: transparent;
  color: var(--clv-color-text-muted);
  cursor: pointer;
  font-size: 1.4rem;
  &:focus-visible {
    @include focus-ring;
  }
}
.clv-drawer__body {
  min-height: 0;
  flex: 1;
  padding: var(--clv-space-4);
  overflow: auto;
  color: var(--clv-color-text);
}
@keyframes clv-drawer-in {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
}
</style>
