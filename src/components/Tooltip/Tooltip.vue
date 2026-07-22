<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'

const open = defineModel<boolean>('open')

withDefaults(
  defineProps<{
    content?: string
    delayDuration?: number
    disabled?: boolean
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
  }>(),
  { delayDuration: 500, disabled: false, side: 'top', align: 'center', sideOffset: 6 },
)
</script>

<template>
  <TooltipProvider :delay-duration="delayDuration" :disabled="disabled">
    <TooltipRoot v-model:open="open" :delay-duration="delayDuration" :disabled="disabled">
      <TooltipTrigger as-child><slot /></TooltipTrigger>
      <TooltipContent
        class="clv-tooltip"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :collision-padding="8"
      >
        <slot name="content">{{ content }}</slot>
        <TooltipArrow class="clv-tooltip__arrow" />
      </TooltipContent>
    </TooltipRoot>
  </TooltipProvider>
</template>

<style scoped lang="scss">
.clv-tooltip {
  z-index: 1200;
  max-width: 18rem;
  padding: 0.4rem 0.65rem;
  border-radius: var(--clv-radius-sm);
  background: var(--clv-color-text);
  box-shadow: var(--clv-shadow-sm);
  color: var(--clv-color-bg);
  font-family: var(--clv-font-sans);
  font-size: 0.8rem;
  line-height: 1.35;

  &[data-state='delayed-open'],
  &[data-state='instant-open'] {
    animation: clv-tooltip-in var(--clv-motion-fast) ease-out;
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
</style>
