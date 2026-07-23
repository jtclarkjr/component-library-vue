<script setup lang="ts">
import {
  MenubarContent,
  MenubarMenu as RekaMenubarMenu,
  MenubarPortal,
  MenubarRoot,
  MenubarTrigger,
} from 'reka-ui'

import MenuEntries from '../_shared/MenuEntries.vue'
import type { ClvValue, MenuEntry, MenubarMenu } from '../../types'

const model = defineModel<string>({ default: '' })
withDefaults(defineProps<{ menus: MenubarMenu[]; label?: string; loop?: boolean }>(), {
  label: 'Application menu',
  loop: true,
})
const emit = defineEmits<{
  select: [entry: MenuEntry, event: Event]
  action: [entry: MenuEntry]
  checkboxChange: [entry: MenuEntry, checked: boolean]
  radioChange: [entry: MenuEntry, value: ClvValue]
}>()
</script>

<template>
  <MenubarRoot v-model="model" class="clv-menubar" :loop="loop" :aria-label="label">
    <RekaMenubarMenu v-for="menu in menus" :key="menu.value" :value="menu.value">
      <MenubarTrigger class="clv-menubar__trigger" :disabled="menu.disabled">{{
        menu.label
      }}</MenubarTrigger>
      <MenubarPortal>
        <MenubarContent class="clv-menubar__content" align="start" :side-offset="6">
          <MenuEntries
            :entries="menu.entries"
            kind="menubar"
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
        </MenubarContent>
      </MenubarPortal>
    </RekaMenubarMenu>
  </MenubarRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;
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
</style>
