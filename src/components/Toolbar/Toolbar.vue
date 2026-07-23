<script setup lang="ts">
import {
  ToolbarButton,
  ToolbarLink,
  ToolbarRoot,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from 'reka-ui'

import type { ToolbarEntry } from '../../types'

withDefaults(
  defineProps<{
    entries: ToolbarEntry[]
    label?: string
    orientation?: 'horizontal' | 'vertical'
    loop?: boolean
  }>(),
  { label: 'Toolbar', orientation: 'horizontal', loop: true },
)
const emit = defineEmits<{
  action: [entry: Extract<ToolbarEntry, { type?: 'action' }>]
  toggle: [entry: Extract<ToolbarEntry, { type: 'toggle' }>, pressed: boolean]
}>()
</script>

<template>
  <ToolbarRoot
    class="clv-toolbar"
    :class="`clv-toolbar--${orientation}`"
    :orientation="orientation"
    :loop="loop"
    :aria-label="label"
  >
    <template v-for="entry in entries" :key="entry.value">
      <slot name="entry" :entry="entry">
        <ToolbarSeparator v-if="entry.type === 'separator'" class="clv-toolbar__separator" />
        <ToolbarLink
          v-else-if="entry.type === 'link'"
          class="clv-toolbar__item"
          :href="entry.href"
          :target="entry.target"
          :rel="entry.rel"
          :aria-disabled="entry.disabled || undefined"
          @click="entry.disabled && $event.preventDefault()"
        >
          {{ entry.label }}
        </ToolbarLink>
        <ToolbarToggleGroup
          v-else-if="entry.type === 'toggle'"
          type="single"
          :model-value="entry.pressed ? entry.value : undefined"
          @update:model-value="emit('toggle', entry, $event === entry.value)"
        >
          <ToolbarToggleItem
            class="clv-toolbar__item"
            :value="entry.value"
            :disabled="entry.disabled"
          >
            {{ entry.label }}
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
        <ToolbarButton
          v-else
          class="clv-toolbar__item"
          :class="{ 'clv-toolbar__item--destructive': entry.destructive }"
          :disabled="entry.disabled"
          @click="emit('action', entry)"
        >
          <slot name="action" :entry="entry">{{ entry.label }}</slot>
        </ToolbarButton>
      </slot>
    </template>
  </ToolbarRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-toolbar {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: var(--clv-space-1);
  padding: var(--clv-space-1);
  border: 1px solid var(--clv-color-border);
  border-radius: var(--clv-radius-md);
  background: var(--clv-color-surface);
  font-family: var(--clv-font-sans);
  &--vertical {
    flex-direction: column;
    align-items: stretch;
  }
  &__item {
    padding: 0.5rem 0.65rem;
    border: 0;
    border-radius: var(--clv-radius-sm);
    background: transparent;
    color: var(--clv-color-text);
    cursor: pointer;
    font: inherit;
    text-decoration: none;
  }
  &__item:hover {
    background: rgb(255 255 255 / 7%);
  }
  &__item:focus-visible {
    @include focus-ring;
  }
  &__item[data-state='on'] {
    background: var(--clv-color-selection);
    color: var(--clv-color-primary);
  }
  &__item:disabled,
  &__item[aria-disabled='true'] {
    @include disabled;
  }
  &__item--destructive {
    color: var(--clv-color-danger);
  }
  &__separator {
    width: 1px;
    height: 1.5rem;
    margin: 0 var(--clv-space-1);
    background: var(--clv-color-border);
  }
  &--vertical &__separator {
    width: 100%;
    height: 1px;
    margin: var(--clv-space-1) 0;
  }
}
</style>
