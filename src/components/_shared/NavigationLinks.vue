<script setup lang="ts">
import { NavigationMenuLink } from 'reka-ui'
import type { NavigationMenuItem } from '../../types'

defineProps<{ items: NavigationMenuItem[] }>()
const emit = defineEmits<{ select: [item: NavigationMenuItem, event: Event] }>()
</script>

<template>
  <ul class="clv-navigation-links">
    <li v-for="item in items" :key="item.value">
      <NavigationMenuLink as-child :active="false">
        <a
          class="clv-navigation-links__link"
          :href="item.href || '#'"
          :target="item.target"
          :rel="item.rel"
          :aria-disabled="item.disabled || undefined"
          @click="item.disabled ? $event.preventDefault() : emit('select', item, $event)"
        >
          <slot name="link" :item="item">
            <strong>{{ item.label }}</strong>
            <small v-if="item.description">{{ item.description }}</small>
          </slot>
        </a>
      </NavigationMenuLink>
      <NavigationLinks
        v-if="item.children?.length"
        :items="item.children"
        @select="(child, event) => emit('select', child, event)"
      >
        <template #link="slotProps"><slot name="link" v-bind="slotProps" /></template>
      </NavigationLinks>
    </li>
  </ul>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;
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
</style>
