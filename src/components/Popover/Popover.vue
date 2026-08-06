<script setup lang="ts">
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { useClvComponent } from '../../headless'
import type { PopoverPartContext, PopoverParts } from '../../parts'

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(
  defineProps<{
    modal?: boolean
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
    unstyled?: boolean
    parts?: PopoverParts
  }>(),
  { modal: false, side: 'bottom', align: 'center', sideOffset: 8 },
)

const { classes, part, slotContext } = useClvComponent<PopoverPartContext>('popover', props)

function close() {
  open.value = false
}
</script>

<template>
  <PopoverRoot v-model:open="open" :modal="modal" v-bind="part('root', { open })">
    <PopoverTrigger v-bind="part('trigger', { open }, {}, { surface: true })" as-child>
      <slot name="trigger" :context="slotContext('trigger', { open })" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        :class="classes('clv-popover')"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :collision-padding="8"
        v-bind="part('content', { open }, {}, { surface: true })"
      >
        <slot :close="close" :context="slotContext('content', { open })" />
        <PopoverArrow :class="classes('clv-popover__arrow')" v-bind="part('arrow', { open })" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
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
}
</style>
