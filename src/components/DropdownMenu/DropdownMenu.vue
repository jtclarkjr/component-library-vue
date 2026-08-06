<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'

import { useClvComponent } from '../../headless'
import type { DropdownMenuPartContext, DropdownMenuParts } from '../../parts'
import MenuEntries from '../_shared/MenuEntries.vue'
import type { ClvValue, DropdownMenuEntry } from '../../types'

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(
  defineProps<{
    items: DropdownMenuEntry[]
    modal?: boolean
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
    unstyled?: boolean
    parts?: DropdownMenuParts
  }>(),
  { modal: true, side: 'bottom', align: 'start', sideOffset: 6 },
)

const { classes, part, slotContext, unstyled } = useClvComponent<DropdownMenuPartContext>(
  'dropdown-menu',
  props,
)

const emit = defineEmits<{
  select: [entry: DropdownMenuEntry, event: Event]
  action: [entry: DropdownMenuEntry]
  checkboxChange: [entry: DropdownMenuEntry, checked: boolean]
  radioChange: [entry: DropdownMenuEntry, value: ClvValue]
}>()
</script>

<template>
  <DropdownMenuRoot v-model:open="open" :modal="modal" v-bind="part('root', { open })">
    <DropdownMenuTrigger as-child v-bind="part('trigger', { open }, {}, { surface: true })">
      <slot name="trigger" :context="slotContext('trigger', { open })" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        :class="classes('clv-dropdown-menu')"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :collision-padding="8"
        v-bind="part('content', { open }, {}, { surface: true })"
      >
        <MenuEntries
          :entries="items"
          kind="dropdown"
          component="dropdown-menu"
          :unstyled="unstyled"
          :parts="parts"
          @action="emit('action', $event)"
          @select="(entry, event) => emit('select', entry, event)"
          @checkbox-change="(entry, checked) => emit('checkboxChange', entry, checked)"
          @radio-change="(entry, value) => emit('radioChange', entry, value)"
        >
          <template #item="slotProps"
            ><slot name="item" :item="slotProps.entry" :context="slotProps.context">{{
              'label' in slotProps.entry ? slotProps.entry.label : ''
            }}</slot></template
          >
          <template v-if="$slots['submenu-indicator']" #submenu-indicator="slotProps">
            <slot name="submenu-indicator" v-bind="slotProps" />
          </template>
          <template v-if="$slots.indicator" #indicator="slotProps">
            <slot name="indicator" v-bind="slotProps" />
          </template>
        </MenuEntries>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-dropdown-menu {
    @include floating-surface;
    z-index: 1100;
    min-width: var(--clv-menu-min-width);
    padding: var(--clv-space-1);
    font-family: var(--clv-font-sans);

    &[data-state='open'] {
      animation: clv-dropdown-in var(--clv-motion-fast) ease-out;
    }
  }

  @keyframes clv-dropdown-in {
    from {
      opacity: 0;
      transform: translateY(-0.2rem) scale(0.98);
    }
  }
}
</style>
