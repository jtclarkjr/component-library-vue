<script setup lang="ts">
import {
  ContextMenuCheckboxItem,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuItemIndicator,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  MenubarCheckboxItem,
  MenubarGroup,
  MenubarItem,
  MenubarItemIndicator,
  MenubarLabel,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from 'reka-ui'

import type { ClvValue, MenuEntry } from '../../types'

const props = defineProps<{
  entries: MenuEntry[]
  kind: 'dropdown' | 'context' | 'menubar'
}>()
const emit = defineEmits<{
  action: [entry: MenuEntry]
  select: [entry: MenuEntry, event: Event]
  checkboxChange: [entry: MenuEntry, checked: boolean]
  radioChange: [entry: MenuEntry, value: ClvValue]
}>()

const suites = {
  dropdown: {
    Item: DropdownMenuItem,
    Separator: DropdownMenuSeparator,
    Label: DropdownMenuLabel,
    Group: DropdownMenuGroup,
    Sub: DropdownMenuSub,
    SubTrigger: DropdownMenuSubTrigger,
    SubContent: DropdownMenuSubContent,
    Portal: DropdownMenuPortal,
    CheckboxItem: DropdownMenuCheckboxItem,
    ItemIndicator: DropdownMenuItemIndicator,
    RadioGroup: DropdownMenuRadioGroup,
    RadioItem: DropdownMenuRadioItem,
  },
  context: {
    Item: ContextMenuItem,
    Separator: ContextMenuSeparator,
    Label: ContextMenuLabel,
    Group: ContextMenuGroup,
    Sub: ContextMenuSub,
    SubTrigger: ContextMenuSubTrigger,
    SubContent: ContextMenuSubContent,
    Portal: ContextMenuPortal,
    CheckboxItem: ContextMenuCheckboxItem,
    ItemIndicator: ContextMenuItemIndicator,
    RadioGroup: ContextMenuRadioGroup,
    RadioItem: ContextMenuRadioItem,
  },
  menubar: {
    Item: MenubarItem,
    Separator: MenubarSeparator,
    Label: MenubarLabel,
    Group: MenubarGroup,
    Sub: MenubarSub,
    SubTrigger: MenubarSubTrigger,
    SubContent: MenubarSubContent,
    Portal: MenubarPortal,
    CheckboxItem: MenubarCheckboxItem,
    ItemIndicator: MenubarItemIndicator,
    RadioGroup: MenubarRadioGroup,
    RadioItem: MenubarRadioItem,
  },
} as const
const suite = suites[props.kind]

function onSelect(entry: MenuEntry, event: Event) {
  emit('select', entry, event)
  emit('action', entry)
}
</script>

<template>
  <template v-for="entry in entries" :key="entry.value">
    <component
      :is="suite.Separator"
      v-if="entry.type === 'separator'"
      class="clv-menu-entry__separator"
    />
    <component :is="suite.Label" v-else-if="entry.type === 'label'" class="clv-menu-entry__label">
      {{ entry.label }}
    </component>
    <component :is="suite.Group" v-else-if="entry.type === 'group'">
      <component :is="suite.Label" v-if="entry.label" class="clv-menu-entry__label">
        {{ entry.label }}
      </component>
      <MenuEntries
        :entries="entry.items"
        :kind="kind"
        @action="emit('action', $event)"
        @select="(item, event) => emit('select', item, event)"
        @checkbox-change="(item, checked) => emit('checkboxChange', item, checked)"
        @radio-change="(item, value) => emit('radioChange', item, value)"
      >
        <template #item="slotProps"><slot name="item" v-bind="slotProps" /></template>
      </MenuEntries>
    </component>
    <component :is="suite.Sub" v-else-if="entry.type === 'submenu'">
      <component
        :is="suite.SubTrigger"
        class="clv-menu-entry__item clv-menu-entry__item--submenu"
        :disabled="entry.disabled"
      >
        <slot name="item" :entry="entry">{{ entry.label }}</slot>
        <span aria-hidden="true">›</span>
      </component>
      <component :is="suite.Portal">
        <component :is="suite.SubContent" class="clv-menu-entry__content" :side-offset="4">
          <MenuEntries
            :entries="entry.items"
            :kind="kind"
            @action="emit('action', $event)"
            @select="(item, event) => emit('select', item, event)"
            @checkbox-change="(item, checked) => emit('checkboxChange', item, checked)"
            @radio-change="(item, value) => emit('radioChange', item, value)"
          >
            <template #item="slotProps"><slot name="item" v-bind="slotProps" /></template>
          </MenuEntries>
        </component>
      </component>
    </component>
    <component
      :is="suite.CheckboxItem"
      v-else-if="entry.type === 'checkbox'"
      class="clv-menu-entry__item"
      :class="{ 'clv-menu-entry__item--destructive': entry.destructive }"
      :model-value="entry.checked"
      :disabled="entry.disabled"
      @update:model-value="emit('checkboxChange', entry, $event === true)"
    >
      <component :is="suite.ItemIndicator" class="clv-menu-entry__indicator">✓</component>
      <slot name="item" :entry="entry">{{ entry.label }}</slot>
    </component>
    <component
      :is="suite.RadioGroup"
      v-else-if="entry.type === 'radio-group'"
      :model-value="entry.selectedValue"
      @update:model-value="emit('radioChange', entry, $event)"
    >
      <component :is="suite.Label" v-if="entry.label" class="clv-menu-entry__label">
        {{ entry.label }}
      </component>
      <component
        :is="suite.RadioItem"
        v-for="option in entry.options"
        :key="option.value"
        class="clv-menu-entry__item"
        :class="{ 'clv-menu-entry__item--destructive': option.destructive }"
        :value="option.value"
        :disabled="option.disabled"
      >
        <component :is="suite.ItemIndicator" class="clv-menu-entry__indicator">●</component>
        {{ option.label }}
      </component>
    </component>
    <component
      :is="suite.Item"
      v-else
      class="clv-menu-entry__item"
      :class="{ 'clv-menu-entry__item--destructive': entry.destructive }"
      :disabled="entry.disabled"
      :as-child="Boolean(entry.href)"
      @select="onSelect(entry, $event)"
    >
      <a v-if="entry.href" :href="entry.href" :target="entry.target" :rel="entry.rel">
        <slot name="item" :entry="entry">{{ entry.label }}</slot>
      </a>
      <slot v-else name="item" :entry="entry">{{ entry.label }}</slot>
    </component>
  </template>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-menu-entry {
  &__content {
    @include floating-surface;
    z-index: 1200;
    min-width: var(--clv-menu-min-width);
    padding: var(--clv-space-1);
    font-family: var(--clv-font-sans);
  }
  &__item {
    @include menu-item;
    position: relative;
    padding-left: 1.9rem;
    &--destructive {
      color: var(--clv-color-danger);
    }
    &--submenu {
      justify-content: space-between;
    }
    > a {
      width: 100%;
      color: inherit;
      text-decoration: none;
    }
  }
  &__indicator {
    position: absolute;
    left: 0.65rem;
    color: var(--clv-color-primary);
  }
  &__label {
    padding: 0.45rem 0.7rem;
    color: var(--clv-color-text-muted);
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
  }
  &__separator {
    height: 1px;
    margin: var(--clv-space-1) 0;
    background: var(--clv-color-border);
  }
}
</style>
