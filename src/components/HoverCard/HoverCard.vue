<script setup lang="ts">
import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'reka-ui'

const open = defineModel<boolean>('open', { default: false })
withDefaults(
  defineProps<{
    text?: string
    openDelay?: number
    closeDelay?: number
    enableTouch?: boolean
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
  }>(),
  {
    text: undefined,
    openDelay: 500,
    closeDelay: 250,
    enableTouch: false,
    side: 'bottom',
    align: 'center',
    sideOffset: 8,
  },
)
</script>

<template>
  <HoverCardRoot
    v-model:open="open"
    :open-delay="openDelay"
    :close-delay="closeDelay"
    :enable-touch="enableTouch"
  >
    <HoverCardTrigger as-child><slot name="trigger" /></HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent
        class="clv-hover-card"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :collision-padding="8"
      >
        <slot name="content" :open="open">{{ text }}</slot>
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;
.clv-hover-card {
  @include floating-surface;
  z-index: 1100;
  width: min(22rem, var(--reka-hover-card-content-available-width));
  padding: var(--clv-space-4);
  font-family: var(--clv-font-sans);
  line-height: 1.5;
  &[data-state='open'] {
    animation: clv-hover-in var(--clv-motion-fast) ease-out;
  }
  @include reduced-motion;
}
@keyframes clv-hover-in {
  from {
    opacity: 0;
    transform: translateY(-0.2rem) scale(0.98);
  }
}
</style>
