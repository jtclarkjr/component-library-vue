<script setup lang="ts">
import { computed } from 'vue'
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from 'reka-ui'
import { useClvComponent } from '../../headless'
import type { ScrollAreaPartContext, ScrollAreaParts } from '../../parts'

const props = withDefaults(
  defineProps<{
    type?: 'auto' | 'always' | 'scroll' | 'hover' | 'glimpse'
    orientation?: 'vertical' | 'horizontal' | 'both'
    scrollHideDelay?: number
    maxHeight?: string | number
    unstyled?: boolean
    parts?: ScrollAreaParts
  }>(),
  { type: 'hover', orientation: 'vertical', scrollHideDelay: 600, maxHeight: '24rem' },
)
const { classes, part, slotContext } = useClvComponent<ScrollAreaPartContext>('scroll-area', props)

const resolvedMaxHeight = computed(() =>
  typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight,
)
</script>

<template>
  <ScrollAreaRoot
    :class="classes('clv-scroll-area')"
    :type="type"
    :scroll-hide-delay="scrollHideDelay"
    :style="{ maxHeight: resolvedMaxHeight }"
    v-bind="part('root', { orientation })"
  >
    <ScrollAreaViewport
      :class="classes('clv-scroll-area__viewport')"
      v-bind="part('viewport', { orientation })"
      ><slot :context="slotContext('viewport', { orientation })"
    /></ScrollAreaViewport>
    <ScrollAreaScrollbar
      v-if="orientation === 'vertical' || orientation === 'both'"
      :class="classes('clv-scroll-area__scrollbar')"
      orientation="vertical"
      v-bind="part('scrollbar', { orientation: 'vertical' })"
    >
      <ScrollAreaThumb
        :class="classes('clv-scroll-area__thumb')"
        v-bind="part('thumb', { orientation: 'vertical' })"
      />
    </ScrollAreaScrollbar>
    <ScrollAreaScrollbar
      v-if="orientation === 'horizontal' || orientation === 'both'"
      :class="classes('clv-scroll-area__scrollbar')"
      orientation="horizontal"
      v-bind="part('scrollbar', { orientation: 'horizontal' })"
    >
      <ScrollAreaThumb
        :class="classes('clv-scroll-area__thumb')"
        v-bind="part('thumb', { orientation: 'horizontal' })"
      />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner
      :class="classes('clv-scroll-area__corner')"
      v-bind="part('corner', { orientation })"
    />
  </ScrollAreaRoot>
</template>

<style scoped lang="scss">
@layer clv.components {
  .clv-scroll-area {
    position: relative;
    overflow: hidden;
    width: 100%;
    border: 1px solid var(--clv-color-border);
    border-radius: var(--clv-radius-md);
    background: var(--clv-color-surface);
    color: var(--clv-color-text-muted);
    font-family: var(--clv-font-sans);

    &__viewport {
      width: 100%;
      height: 100%;
      max-height: inherit;
      border-radius: inherit;
    }

    &__scrollbar {
      display: flex;
      padding: 2px;
      background: rgb(255 255 255 / 3%);
      touch-action: none;
      user-select: none;

      &[data-orientation='vertical'] {
        width: 0.7rem;
      }

      &[data-orientation='horizontal'] {
        height: 0.7rem;
        flex-direction: column;
      }
    }

    &__thumb {
      position: relative;
      flex: 1;
      border-radius: 999px;
      background: var(--clv-color-border);
    }

    &__corner {
      background: var(--clv-color-surface-raised);
    }
  }
}
</style>
