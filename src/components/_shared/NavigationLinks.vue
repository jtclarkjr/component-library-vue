<script setup lang="ts">
import { NavigationMenuLink } from 'reka-ui'
import { useClvComponent } from '../../headless'
import type { NavigationMenuPartContext, NavigationMenuParts } from '../../parts'
import type { NavigationMenuItem } from '../../types'

const props = defineProps<{
  items: NavigationMenuItem[]
  depth?: number
  unstyled?: boolean
  parts?: NavigationMenuParts
}>()
const { classes, part, slotContext } = useClvComponent<NavigationMenuPartContext>(
  'navigation-menu',
  props,
)
const emit = defineEmits<{ select: [item: NavigationMenuItem, event: Event] }>()
</script>

<template>
  <ul :class="classes('clv-navigation-links')" v-bind="part('list', { depth: depth ?? 0 })">
    <li
      v-for="(item, index) in items"
      :key="item.value"
      v-bind="part('item', { item, index, depth: depth ?? 0, disabled: item.disabled })"
    >
      <NavigationMenuLink as-child :active="false">
        <a
          :class="classes('clv-navigation-links__link')"
          :href="item.href || '#'"
          :target="item.target"
          :rel="item.rel"
          :aria-disabled="item.disabled || undefined"
          @click="item.disabled ? $event.preventDefault() : emit('select', item, $event)"
          v-bind="part('link', { item, index, depth: depth ?? 0, disabled: item.disabled })"
        >
          <slot
            name="link"
            :item="item"
            :context="
              slotContext('link', { item, index, depth: depth ?? 0, disabled: item.disabled })
            "
          >
            <strong>{{ item.label }}</strong>
            <small v-if="item.description">{{ item.description }}</small>
          </slot>
        </a>
      </NavigationMenuLink>
      <NavigationLinks
        v-if="item.children?.length"
        :items="item.children"
        :depth="(depth ?? 0) + 1"
        :unstyled="unstyled"
        :parts="parts"
        @select="(child, event) => emit('select', child, event)"
      >
        <template #link="slotProps"><slot name="link" v-bind="slotProps" /></template>
      </NavigationLinks>
    </li>
  </ul>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-navigation-links {
    display: grid;
    min-width: 16rem;
    gap: var(--clv-space-1);
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .clv-navigation-links .clv-navigation-links {
    margin-top: var(--clv-space-1);
    padding-left: var(--clv-space-4);
    border-left: 1px solid var(--clv-color-border);
  }
  .clv-navigation-links__link {
    display: grid;
    gap: var(--clv-space-1);
    padding: 0.6rem 0.7rem;
    border-radius: var(--clv-radius-sm);
    color: var(--clv-color-text);
    text-decoration: none;
    &:hover {
      background: var(--clv-color-selection);
    }
    &:focus-visible {
      @include focus-ring;
    }
    &[aria-disabled='true'] {
      @include disabled;
    }
    small {
      color: var(--clv-color-text-muted);
    }
  }
}
</style>
