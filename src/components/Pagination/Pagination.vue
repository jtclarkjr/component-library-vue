<script setup lang="ts">
import {
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from 'reka-ui'
import { useClvComponent } from '../../headless'
import type { PaginationPartContext, PaginationParts } from '../../parts'

const page = defineModel<number>('page', { default: 1 })

const props = withDefaults(
  defineProps<{
    total: number
    itemsPerPage?: number
    siblingCount?: number
    showEdges?: boolean
    disabled?: boolean
    ariaLabel?: string
    previousLabel?: string
    nextLabel?: string
    unstyled?: boolean
    parts?: PaginationParts
  }>(),
  {
    itemsPerPage: 10,
    siblingCount: 1,
    showEdges: true,
    disabled: false,
    ariaLabel: 'Pagination',
    previousLabel: 'Previous page',
    nextLabel: 'Next page',
  },
)
const { classes, part, slotContext } = useClvComponent<PaginationPartContext>('pagination', props)
</script>

<template>
  <PaginationRoot
    v-model:page="page"
    :class="classes('clv-pagination')"
    :total="total"
    :items-per-page="itemsPerPage"
    :sibling-count="siblingCount"
    :show-edges="showEdges"
    :disabled="disabled"
    :aria-label="ariaLabel"
    v-bind="part('root', { disabled })"
  >
    <PaginationList
      v-slot="{ items }"
      :class="classes('clv-pagination__list')"
      v-bind="part('list', { disabled })"
    >
      <PaginationFirst
        v-if="showEdges"
        :class="classes('clv-pagination__button')"
        aria-label="First page"
        v-bind="part('first', { disabled })"
      >
        <slot name="first" :context="slotContext('first', { disabled })">«</slot>
      </PaginationFirst>
      <PaginationPrev
        :class="classes('clv-pagination__button')"
        :aria-label="previousLabel"
        v-bind="part('previous', { disabled })"
        ><slot name="previous" :context="slotContext('previous', { disabled })"
          >‹</slot
        ></PaginationPrev
      >
      <template v-for="(item, index) in items" :key="index">
        <PaginationListItem
          v-if="item.type === 'page'"
          :class="classes('clv-pagination__button')"
          :value="item.value"
          :aria-label="`Page ${item.value}`"
          v-bind="part('page', { disabled, page: item.value, index })"
        >
          <slot
            name="page"
            :page="item.value"
            :index="index"
            :context="slotContext('page', { page: item.value, index, disabled })"
            >{{ item.value }}</slot
          >
        </PaginationListItem>
        <PaginationEllipsis
          v-else
          :class="classes('clv-pagination__ellipsis')"
          v-bind="part('ellipsis', { disabled, index })"
          ><slot
            name="ellipsis"
            :index="index"
            :context="slotContext('ellipsis', { index, disabled })"
            >…</slot
          ></PaginationEllipsis
        >
      </template>
      <PaginationNext
        :class="classes('clv-pagination__button')"
        :aria-label="nextLabel"
        v-bind="part('next', { disabled })"
        ><slot name="next" :context="slotContext('next', { disabled })">›</slot></PaginationNext
      >
      <PaginationLast
        v-if="showEdges"
        :class="classes('clv-pagination__button')"
        aria-label="Last page"
        v-bind="part('last', { disabled })"
      >
        <slot name="last" :context="slotContext('last', { disabled })">»</slot>
      </PaginationLast>
    </PaginationList>
  </PaginationRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-pagination {
    color: var(--clv-color-text);
    font-family: var(--clv-font-sans);

    &__list {
      display: flex;
      align-items: center;
      gap: var(--clv-space-1);
      padding: 0;
      margin: 0;
      list-style: none;
    }

    &__button {
      display: inline-flex;
      min-width: 2.25rem;
      min-height: 2.25rem;
      align-items: center;
      justify-content: center;
      padding: 0.4rem;
      border: 1px solid var(--clv-color-border);
      border-radius: var(--clv-radius-sm);
      background: var(--clv-color-surface);
      color: var(--clv-color-text-muted);
      cursor: pointer;
      font: inherit;

      &[data-selected] {
        border-color: var(--clv-color-primary);
        background: var(--clv-color-primary);
        color: #06231b;
        font-weight: 800;
      }

      &:focus-visible {
        @include focus-ring;
      }

      &:disabled {
        @include disabled;
      }
    }

    &__ellipsis {
      display: inline-flex;
      min-width: 2rem;
      justify-content: center;
      color: var(--clv-color-text-muted);
    }
  }
}
</style>
