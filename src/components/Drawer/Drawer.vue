<script setup lang="ts">
import { mergeProps } from 'vue'
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
import { useClvComponent } from '../../headless'
import type { DrawerPartContext, DrawerParts } from '../../parts'

const open = defineModel<boolean>('open', { default: false })
const snapPoint = defineModel<number | string | null>('snapPoint', { default: null })
const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    modal?: boolean | 'trap-focus'
    direction?: 'down' | 'up' | 'left' | 'right'
    snapPoints?: Array<number | string>
    snapToSequentialPoints?: boolean
    showHandle?: boolean
    closeLabel?: string
    unstyled?: boolean
    parts?: DrawerParts
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
const { classes, part, slotContext } = useClvComponent<DrawerPartContext>('drawer', props)
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
    <DrawerTrigger
      as-child
      v-bind="part('trigger', { open, direction, value: snapPoint }, {}, { surface: true })"
    >
      <slot
        name="trigger"
        :context="slotContext('trigger', { open, direction, value: snapPoint })"
      />
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay
        v-if="modal === true"
        :class="classes('clv-drawer__overlay')"
        v-bind="part('overlay', { open, direction, value: snapPoint }, {}, { surface: true })"
      />
      <DrawerContent
        :class="classes(['clv-drawer', `clv-drawer--${direction}`])"
        v-bind="
          mergeProps(
            part('root', { open, direction, value: snapPoint }),
            part('content', { open, direction, value: snapPoint }, {}, { surface: true }),
          )
        "
      >
        <slot
          name="handle"
          :close="close"
          :context="slotContext('handle', { open, direction, value: snapPoint })"
        >
          <DrawerHandle
            v-if="showHandle"
            :class="classes('clv-drawer__handle')"
            v-bind="part('handle', { open, direction, value: snapPoint })"
          />
        </slot>
        <header
          :class="classes('clv-drawer__header')"
          v-bind="part('header', { open, direction, value: snapPoint })"
        >
          <div>
            <DrawerTitle
              :class="classes('clv-drawer__title')"
              v-bind="part('title', { open, direction, value: snapPoint })"
              >{{ title }}</DrawerTitle
            >
            <DrawerDescription
              v-if="description"
              :class="classes('clv-drawer__description')"
              v-bind="part('description', { open, direction, value: snapPoint })"
            >
              {{ description }}
            </DrawerDescription>
          </div>
          <DrawerClose
            :class="classes('clv-drawer__close')"
            :aria-label="closeLabel"
            v-bind="part('close', { open, direction, value: snapPoint })"
            ><slot
              name="close"
              :context="slotContext('close', { open, direction, value: snapPoint })"
              >×</slot
            ></DrawerClose
          >
        </header>
        <div
          :class="classes('clv-drawer__body')"
          v-bind="part('body', { open, direction, value: snapPoint })"
        >
          <slot
            name="body"
            :close="close"
            :context="slotContext('body', { open, direction, value: snapPoint })"
          >
            <slot
              :close="close"
              :context="slotContext('body', { open, direction, value: snapPoint })"
            />
          </slot>
        </div>
        <footer
          v-if="$slots.footer"
          :class="classes('clv-drawer__footer')"
          v-bind="part('footer', { open, direction, value: snapPoint })"
        >
          <slot
            name="footer"
            :close="close"
            :context="slotContext('footer', { open, direction, value: snapPoint })"
          />
        </footer>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
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
}
</style>
