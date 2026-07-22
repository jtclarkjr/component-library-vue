<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui'

import type { DropdownMenuEntry } from '../../types'

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
        <template v-for="entry in items" :key="entry.value">
          <DropdownMenuSeparator
            v-if="entry.type === 'separator'"
            class="clv-dropdown-menu__separator"
          />
          <DropdownMenuItem
            v-else
            class="clv-dropdown-menu__item"
            :class="{ 'clv-dropdown-menu__item--destructive': entry.destructive }"
            :disabled="entry.disabled"
            @select="emit('select', entry, $event)"
          >
            <slot name="item" :item="entry">{{ entry.label }}</slot>
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-dropdown-menu {
  @include floating-surface;
  z-index: 1100;
  min-width: 12rem;
  padding: var(--clv-space-1);
  font-family: var(--clv-font-sans);

  &[data-state='open'] {
    animation: clv-dropdown-in var(--clv-motion-fast) ease-out;
  }

  &__item {
    display: flex;
    min-height: 2.25rem;
    align-items: center;
    padding: 0.5rem 0.7rem;
    border-radius: var(--clv-radius-sm);
    color: var(--clv-color-text);
    cursor: pointer;
    outline: none;

    &[data-highlighted] {
      background: rgb(255 255 255 / 8%);
    }

    &[data-disabled] {
      @include disabled;
    }

    &--destructive {
      color: var(--clv-color-danger);
    }
  }

  &__separator {
    height: 1px;
    margin: var(--clv-space-1) 0;
    background: var(--clv-color-border);
  }
}

@keyframes clv-dropdown-in {
  from {
    opacity: 0;
    transform: translateY(-0.2rem) scale(0.98);
  }
}
</style>
