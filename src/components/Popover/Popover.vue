<script setup lang="ts">
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'

const open = defineModel<boolean>('open', { default: false })

withDefaults(
  defineProps<{
    modal?: boolean
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
  }>(),
  { modal: false, side: 'bottom', align: 'center', sideOffset: 8 },
)

function close() {
  open.value = false
}
</script>

<template>
  <PopoverRoot v-model:open="open" :modal="modal">
    <PopoverTrigger as-child><slot name="trigger" /></PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        class="clv-popover"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :collision-padding="8"
      >
        <slot :close="close" />
        <PopoverArrow class="clv-popover__arrow" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-popover {
  @include floating-surface;
  z-index: 1100;
  width: min(22rem, calc(100vw - 2rem));
  padding: var(--clv-space-4);
  font-family: var(--clv-font-sans);

  &[data-state='open'] {
    animation: clv-popover-in var(--clv-motion-fast) ease-out;
  }

  &:focus-visible {
    @include focus-ring;
  }

  &__arrow {
    fill: var(--clv-color-surface-raised);
  }
}

@keyframes clv-popover-in {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
}
</style>
