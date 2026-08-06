<script setup lang="ts">
import { ContextMenuContent, ContextMenuPortal, ContextMenuRoot, ContextMenuTrigger } from 'reka-ui'

import { useClvComponent } from '../../headless'
import type { ContextMenuPartContext, ContextMenuParts } from '../../parts'
import MenuEntries from '../_shared/MenuEntries.vue'
import type { ClvValue, MenuEntry } from '../../types'

const open = defineModel<boolean>('open', { default: false })
const props = withDefaults(
  defineProps<{
    items: MenuEntry[]
    modal?: boolean
    pressOpenDelay?: number
    unstyled?: boolean
    parts?: ContextMenuParts
  }>(),
  { modal: true, pressOpenDelay: 700 },
)
const { classes, part, slotContext, unstyled } = useClvComponent<ContextMenuPartContext>(
  'context-menu',
  props,
)
const emit = defineEmits<{
  select: [entry: MenuEntry, event: Event]
  action: [entry: MenuEntry]
  checkboxChange: [entry: MenuEntry, checked: boolean]
  radioChange: [entry: MenuEntry, value: ClvValue]
}>()
</script>

<template>
  <ContextMenuRoot
    :modal="modal"
    :press-open-delay="pressOpenDelay"
    @update:open="open = $event"
    v-bind="part('root', { open })"
  >
    <ContextMenuTrigger as-child v-bind="part('trigger', { open }, {}, { surface: true })"
      ><slot name="trigger" :context="slotContext('trigger', { open })"
        ><slot :context="slotContext('trigger', { open })" /></slot
    ></ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent
        :class="classes('clv-context-menu')"
        :collision-padding="8"
        v-bind="part('content', { open }, {}, { surface: true })"
      >
        <MenuEntries
          :entries="items"
          kind="context"
          component="context-menu"
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
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-context-menu {
    @include floating-surface;
    z-index: 1100;
    min-width: var(--clv-menu-min-width);
    padding: var(--clv-space-1);
    font-family: var(--clv-font-sans);
  }
}
</style>
