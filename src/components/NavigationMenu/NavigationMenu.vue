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
import { useClvComponent } from '../../headless'
import type { NavigationMenuPartContext, NavigationMenuParts } from '../../parts'
import type { NavigationMenuItem } from '../../types'

const model = defineModel<string>({ default: '' })
const props = withDefaults(
  defineProps<{
    items: NavigationMenuItem[]
    label?: string
    orientation?: 'horizontal' | 'vertical'
    delayDuration?: number
    skipDelayDuration?: number
    disableClickTrigger?: boolean
    disableHoverTrigger?: boolean
    unstyled?: boolean
    parts?: NavigationMenuParts
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
const {
  classes,
  part,
  slotContext,
  unstyled: resolvedUnstyled,
} = useClvComponent<NavigationMenuPartContext>('navigation-menu', props)
const emit = defineEmits<{ select: [item: NavigationMenuItem, event: Event] }>()
</script>

<template>
  <NavigationMenuRoot
    v-model="model"
    :class="classes('clv-navigation-menu')"
    :orientation="orientation"
    :delay-duration="delayDuration"
    :skip-delay-duration="skipDelayDuration"
    :disable-click-trigger="disableClickTrigger"
    :disable-hover-trigger="disableHoverTrigger"
    :aria-label="label"
    v-bind="part('root', { orientation, open: Boolean(model) })"
  >
    <NavigationMenuList
      :class="classes('clv-navigation-menu__list')"
      v-bind="part('list', { orientation, depth: 0 })"
    >
      <RekaNavigationMenuItem
        v-for="(item, index) in items"
        :key="item.value"
        :value="item.value"
        v-bind="
          part('item', {
            item,
            index,
            depth: 0,
            disabled: item.disabled,
            orientation,
            open: model === item.value,
          })
        "
      >
        <template v-if="item.children?.length">
          <NavigationMenuTrigger
            :class="classes('clv-navigation-menu__trigger')"
            :disabled="item.disabled"
            v-bind="
              part('trigger', {
                item,
                index,
                depth: 0,
                disabled: item.disabled,
                orientation,
                open: model === item.value,
              })
            "
          >
            <slot
              name="trigger"
              :item="item"
              :context="
                slotContext('trigger', {
                  item,
                  index,
                  depth: 0,
                  disabled: item.disabled,
                  orientation,
                  open: model === item.value,
                })
              "
            >
              {{ item.label }}
              <span aria-hidden="true">
                <slot
                  name="trigger-icon"
                  :item="item"
                  :index="index"
                  :depth="0"
                  :disabled="item.disabled"
                  :orientation="orientation"
                  :open="model === item.value"
                  :context="
                    slotContext('trigger', {
                      item,
                      index,
                      depth: 0,
                      disabled: item.disabled,
                      orientation,
                      open: model === item.value,
                    })
                  "
                  >⌄</slot
                >
              </span>
            </slot>
          </NavigationMenuTrigger>
          <NavigationMenuContent
            :class="classes('clv-navigation-menu__content')"
            v-bind="
              part(
                'content',
                {
                  item,
                  index,
                  depth: 0,
                  disabled: item.disabled,
                  orientation,
                  open: model === item.value,
                },
                {},
                { surface: true },
              )
            "
          >
            <slot
              name="content"
              :item="item"
              :context="
                slotContext('content', {
                  item,
                  index,
                  depth: 0,
                  disabled: item.disabled,
                  orientation,
                  open: model === item.value,
                })
              "
            >
              <NavigationLinks
                :items="item.children"
                :depth="1"
                :unstyled="resolvedUnstyled"
                :parts="parts"
                @select="(child, event) => emit('select', child, event)"
              >
                <template #link="slotProps"><slot name="link" v-bind="slotProps" /></template>
              </NavigationLinks>
            </slot>
          </NavigationMenuContent>
        </template>
        <NavigationMenuLink v-else as-child>
          <a
            :class="classes('clv-navigation-menu__trigger')"
            :href="item.href || '#'"
            :target="item.target"
            :rel="item.rel"
            :aria-disabled="item.disabled || undefined"
            @click="item.disabled ? $event.preventDefault() : emit('select', item, $event)"
            v-bind="part('link', { item, index, depth: 0, disabled: item.disabled, orientation })"
          >
            <slot
              name="link"
              :item="item"
              :context="
                slotContext('link', {
                  item,
                  index,
                  depth: 0,
                  disabled: item.disabled,
                  orientation,
                })
              "
              >{{ item.label }}</slot
            >
          </a>
        </NavigationMenuLink>
      </RekaNavigationMenuItem>
    </NavigationMenuList>
    <div
      :class="classes('clv-navigation-menu__viewport-position')"
      v-bind="part('viewportPosition', { orientation, open: Boolean(model) })"
    >
      <NavigationMenuViewport
        :class="classes('clv-navigation-menu__viewport')"
        v-bind="part('viewport', { orientation, open: Boolean(model) }, {}, { surface: true })"
      />
    </div>
  </NavigationMenuRoot>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
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
}
</style>
