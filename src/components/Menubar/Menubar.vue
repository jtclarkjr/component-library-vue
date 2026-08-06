<script setup lang="ts">
import {
  MenubarContent,
  MenubarMenu as RekaMenubarMenu,
  MenubarPortal,
  MenubarRoot,
  MenubarTrigger,
} from 'reka-ui'

import MenuEntries from '../_shared/MenuEntries.vue'
import { useClvComponent } from '../../headless'
import type { MenubarPartContext, MenubarParts } from '../../parts'
import type { ClvValue, MenuEntry, MenubarMenu } from '../../types'

const model = defineModel<string>({ default: '' })
const props = withDefaults(
  defineProps<{
    menus: MenubarMenu[]
    label?: string
    loop?: boolean
    unstyled?: boolean
    parts?: MenubarParts
  }>(),
  {
    label: 'Application menu',
    loop: true,
  },
)
const {
  classes,
  part,
  unstyled: resolvedUnstyled,
} = useClvComponent<MenubarPartContext>('menubar', props)
const emit = defineEmits<{
  select: [entry: MenuEntry, event: Event]
  action: [entry: MenuEntry]
  checkboxChange: [entry: MenuEntry, checked: boolean]
  radioChange: [entry: MenuEntry, value: ClvValue]
}>()
</script>

<template>
  <MenubarRoot
    v-model="model"
    :class="classes('clv-menubar')"
    :loop="loop"
    :aria-label="label"
    v-bind="part('root', {})"
  >
    <RekaMenubarMenu v-for="(menu, index) in menus" :key="menu.value" :value="menu.value">
      <MenubarTrigger
        :class="classes('clv-menubar__trigger')"
        :disabled="menu.disabled"
        v-bind="
          part('trigger', {
            entry: menu,
            index,
            depth: 0,
            kind: 'menubar',
            disabled: menu.disabled,
          })
        "
        >{{ menu.label }}</MenubarTrigger
      >
      <MenubarPortal>
        <MenubarContent
          :class="classes('clv-menubar__content')"
          align="start"
          :side-offset="6"
          v-bind="
            part(
              'content',
              { entry: menu, index, depth: 0, kind: 'menubar' },
              {},
              { surface: true },
            )
          "
        >
          <MenuEntries
            :entries="menu.entries"
            kind="menubar"
            component="menubar"
            :depth="0"
            :unstyled="resolvedUnstyled"
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
        </MenubarContent>
      </MenubarPortal>
    </RekaMenubarMenu>
  </MenubarRoot>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-menubar {
    display: flex;
    width: fit-content;
    gap: var(--clv-space-1);
    padding: var(--clv-space-1);
    border: 1px solid var(--clv-color-border);
    border-radius: var(--clv-radius-md);
    background: var(--clv-color-surface);
    font-family: var(--clv-font-sans);
  }
  .clv-menubar__trigger {
    padding: 0.5rem 0.7rem;
    border: 0;
    border-radius: var(--clv-radius-sm);
    background: transparent;
    color: var(--clv-color-text);
    cursor: pointer;
    font: inherit;
    &[data-state='open'],
    &[data-highlighted] {
      background: var(--clv-color-selection);
    }
    &:focus-visible {
      @include focus-ring;
    }
    &:disabled {
      @include disabled;
    }
  }
  .clv-menubar__content {
    @include floating-surface;
    z-index: 1100;
    min-width: var(--clv-menu-min-width);
    padding: var(--clv-space-1);
    font-family: var(--clv-font-sans);
  }
}
</style>
