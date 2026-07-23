<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'

import MenuEntries from '../_shared/MenuEntries.vue'
import type { ClvValue, DropdownMenuEntry } from '../../types'

const open = defineModel<boolean>('open', { default: false })

withDefaults(
  defineProps<{
    items: DropdownMenuEntry[]
    modal?: boolean
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
  }>(),
  { modal: true, side: 'bottom', align: 'start', sideOffset: 6 },
)

const emit = defineEmits<{
  select: [entry: DropdownMenuEntry, event: Event]
  action: [entry: DropdownMenuEntry]
  checkboxChange: [entry: DropdownMenuEntry, checked: boolean]
  radioChange: [entry: DropdownMenuEntry, value: ClvValue]
}>()
</script>

<template>
  <DropdownMenuRoot v-model:open="open" :modal="modal">
    <DropdownMenuTrigger as-child><slot name="trigger" /></DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        class="clv-dropdown-menu"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :collision-padding="8"
      >
        <MenuEntries
          :entries="items"
          kind="dropdown"
          @action="emit('action', $event)"
          @select="(entry, event) => emit('select', entry, event)"
          @checkbox-change="(entry, checked) => emit('checkboxChange', entry, checked)"
          @radio-change="(entry, value) => emit('radioChange', entry, value)"
        >
          <template #item="{ entry }"
            ><slot name="item" :item="entry">{{
              'label' in entry ? entry.label : ''
            }}</slot></template
          >
        </MenuEntries>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

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
</style>
