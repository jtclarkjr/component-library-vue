<script setup lang="ts">
import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'reka-ui'
import { useClvComponent } from '../../headless'
import type { HoverCardPartContext, HoverCardParts } from '../../parts'

const open = defineModel<boolean>('open', { default: false })
const props = withDefaults(
  defineProps<{
    text?: string
    openDelay?: number
    closeDelay?: number
    enableTouch?: boolean
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
    unstyled?: boolean
    parts?: HoverCardParts
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
const { classes, part, slotContext } = useClvComponent<HoverCardPartContext>('hover-card', props)
</script>

<template>
  <HoverCardRoot
    v-model:open="open"
    :open-delay="openDelay"
    :close-delay="closeDelay"
    :enable-touch="enableTouch"
    v-bind="part('root', { open })"
  >
    <HoverCardTrigger as-child v-bind="part('trigger', { open }, {}, { surface: true })">
      <slot name="trigger" :context="slotContext('trigger', { open })" />
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent
        :class="classes('clv-hover-card')"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :collision-padding="8"
        v-bind="part('content', { open }, {}, { surface: true })"
      >
        <slot name="content" :open="open" :context="slotContext('content', { open })">{{
          text
        }}</slot>
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
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
}
</style>
