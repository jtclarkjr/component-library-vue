<script setup lang="ts">
import {
  NavigationMenuContent,
  NavigationMenuItem as RekaNavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from 'reka-ui'

import NavigationLinks from '../_shared/NavigationLinks.vue'
import type { NavigationMenuItem } from '../../types'

const model = defineModel<string>({ default: '' })
withDefaults(
  defineProps<{
    items: NavigationMenuItem[]
    label?: string
    orientation?: 'horizontal' | 'vertical'
    delayDuration?: number
    skipDelayDuration?: number
    disableClickTrigger?: boolean
    disableHoverTrigger?: boolean
  }>(),
  {
    label: 'Primary navigation',
    orientation: 'horizontal',
    delayDuration: 200,
    skipDelayDuration: 300,
    disableClickTrigger: false,
    disableHoverTrigger: false,
  },
)
const emit = defineEmits<{ select: [item: NavigationMenuItem, event: Event] }>()
</script>

<template>
  <NavigationMenuRoot
    v-model="model"
    class="clv-navigation-menu"
    :orientation="orientation"
    :delay-duration="delayDuration"
    :skip-delay-duration="skipDelayDuration"
    :disable-click-trigger="disableClickTrigger"
    :disable-hover-trigger="disableHoverTrigger"
    :aria-label="label"
  >
    <NavigationMenuList class="clv-navigation-menu__list">
      <RekaNavigationMenuItem v-for="item in items" :key="item.value" :value="item.value">
        <template v-if="item.children?.length">
          <NavigationMenuTrigger class="clv-navigation-menu__trigger" :disabled="item.disabled">
            <slot name="trigger" :item="item"
              >{{ item.label }} <span aria-hidden="true">⌄</span></slot
            >
          </NavigationMenuTrigger>
          <NavigationMenuContent class="clv-navigation-menu__content">
            <slot name="content" :item="item">
              <NavigationLinks
                :items="item.children"
                @select="(child, event) => emit('select', child, event)"
              >
                <template #link="slotProps"><slot name="link" v-bind="slotProps" /></template>
              </NavigationLinks>
            </slot>
          </NavigationMenuContent>
        </template>
        <NavigationMenuLink v-else as-child>
          <a
            class="clv-navigation-menu__trigger"
            :href="item.href || '#'"
            :target="item.target"
            :rel="item.rel"
            :aria-disabled="item.disabled || undefined"
            @click="item.disabled ? $event.preventDefault() : emit('select', item, $event)"
          >
            <slot name="link" :item="item">{{ item.label }}</slot>
          </a>
        </NavigationMenuLink>
      </RekaNavigationMenuItem>
    </NavigationMenuList>
    <div class="clv-navigation-menu__viewport-position">
      <NavigationMenuViewport class="clv-navigation-menu__viewport" />
    </div>
  </NavigationMenuRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;
.clv-navigation-menu {
  position: relative;
  width: fit-content;
  font-family: var(--clv-font-sans);
}
.clv-navigation-menu__list {
  display: flex;
  gap: var(--clv-space-1);
  margin: 0;
  padding: var(--clv-space-1);
  border: 1px solid var(--clv-color-border);
  border-radius: var(--clv-radius-md);
  background: var(--clv-color-surface);
  list-style: none;
}
.clv-navigation-menu[data-orientation='vertical'] .clv-navigation-menu__list {
  flex-direction: column;
}
.clv-navigation-menu__trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--clv-space-1);
  padding: 0.55rem 0.7rem;
  border: 0;
  border-radius: var(--clv-radius-sm);
  background: transparent;
  color: var(--clv-color-text);
  cursor: pointer;
  font: inherit;
  text-decoration: none;
  &[data-state='open'],
  &:hover {
    background: var(--clv-color-selection);
  }
  &:focus-visible {
    @include focus-ring;
  }
  &:disabled,
  &[aria-disabled='true'] {
    @include disabled;
  }
}
.clv-navigation-menu__viewport-position {
  position: absolute;
  top: calc(100% + var(--clv-space-2));
  left: 0;
  z-index: 1100;
}
.clv-navigation-menu__viewport {
  @include floating-surface;
  width: var(--reka-navigation-menu-viewport-width);
  height: var(--reka-navigation-menu-viewport-height);
  overflow: hidden;
  transition:
    width var(--clv-motion-medium),
    height var(--clv-motion-medium);
}
.clv-navigation-menu__content {
  padding: var(--clv-space-3);
}
</style>
