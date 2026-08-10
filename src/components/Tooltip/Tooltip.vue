<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
import { useClvComponent } from '../../headless'
import type { TooltipPartContext, TooltipParts } from '../../parts'

const open = defineModel<boolean>('open')

const props = withDefaults(
  defineProps<{
    content?: string
    delayDuration?: number
    disabled?: boolean
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
    unstyled?: boolean
    parts?: TooltipParts
  }>(),
  { delayDuration: 500, disabled: false, side: 'top', align: 'center', sideOffset: 6 },
)
const { classes, part, slotContext } = useClvComponent<TooltipPartContext>('tooltip', props)
</script>

<template>
  <TooltipProvider :delay-duration="delayDuration" :disabled="disabled">
    <TooltipRoot
      v-model:open="open"
      :delay-duration="delayDuration"
      :disabled="disabled"
      v-bind="part('root', { open, disabled })"
    >
      <TooltipTrigger v-bind="part('trigger', { open }, {}, { surface: true })" as-child>
        <slot :context="slotContext('trigger', { open })" />
      </TooltipTrigger>
      <TooltipContent
        :class="classes('clv-tooltip')"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :collision-padding="8"
        v-bind="part('content', { open }, {}, { surface: true })"
      >
        <slot name="content" :context="slotContext('content', { open })">{{ content }}</slot>
        <TooltipArrow :class="classes('clv-tooltip__arrow')" v-bind="part('arrow', { open })" />
      </TooltipContent>
    </TooltipRoot>
  </TooltipProvider>
</template>

<style lang="scss">
@layer clv.components {
  .clv-tooltip {
    z-index: var(--clv-z-tooltip);
    max-width: 18rem;
    padding: var(--clv-tooltip-padding);
    border-radius: var(--clv-radius-sm);
    background: var(--clv-color-text);
    box-shadow: var(--clv-shadow-sm);
    color: var(--clv-color-bg);
    font-family: var(--clv-font-sans);
    font-size: var(--clv-font-size-sm);
    line-height: var(--clv-line-height-tooltip);

    &[data-state='delayed-open'],
    &[data-state='instant-open'] {
      animation: clv-tooltip-in var(--clv-motion-fast) var(--clv-motion-easing);
    }

    &__arrow {
      fill: var(--clv-color-text);
    }
  }

  @keyframes clv-tooltip-in {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
  }
}
</style>
