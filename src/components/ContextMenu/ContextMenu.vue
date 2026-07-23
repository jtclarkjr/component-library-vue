<script setup lang="ts">
import { ContextMenuContent, ContextMenuPortal, ContextMenuRoot, ContextMenuTrigger } from 'reka-ui'

import MenuEntries from '../_shared/MenuEntries.vue'
import type { ClvValue, MenuEntry } from '../../types'

const open = defineModel<boolean>('open', { default: false })
withDefaults(
  defineProps<{
    items: MenuEntry[]
    modal?: boolean
    pressOpenDelay?: number
  }>(),
  { modal: true, pressOpenDelay: 700 },
)
const emit = defineEmits<{
  select: [entry: MenuEntry, event: Event]
  action: [entry: MenuEntry]
  checkboxChange: [entry: MenuEntry, checked: boolean]
  radioChange: [entry: MenuEntry, value: ClvValue]
}>()
</script>

<template>
  <ContextMenuRoot :modal="modal" :press-open-delay="pressOpenDelay" @update:open="open = $event">
    <ContextMenuTrigger as-child
      ><slot name="trigger"><slot /></slot
    ></ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent class="clv-context-menu" :collision-padding="8">
        <MenuEntries
          :entries="items"
          kind="context"
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
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;
.clv-context-menu {
  @include floating-surface;
  z-index: 1100;
  min-width: var(--clv-menu-min-width);
  padding: var(--clv-space-1);
  font-family: var(--clv-font-sans);
}
</style>
