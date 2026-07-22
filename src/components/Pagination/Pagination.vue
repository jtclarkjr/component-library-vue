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

const page = defineModel<number>('page', { default: 1 })

withDefaults(
  defineProps<{
    total: number
    itemsPerPage?: number
    siblingCount?: number
    showEdges?: boolean
    disabled?: boolean
    ariaLabel?: string
    previousLabel?: string
    nextLabel?: string
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
</script>

<template>
  <PaginationRoot
    v-model:page="page"
    class="clv-pagination"
    :total="total"
    :items-per-page="itemsPerPage"
    :sibling-count="siblingCount"
    :show-edges="showEdges"
    :disabled="disabled"
    :aria-label="ariaLabel"
  >
    <PaginationList v-slot="{ items }" class="clv-pagination__list">
      <PaginationFirst v-if="showEdges" class="clv-pagination__button" aria-label="First page">
        «
      </PaginationFirst>
      <PaginationPrev class="clv-pagination__button" :aria-label="previousLabel">‹</PaginationPrev>
      <template v-for="(item, index) in items" :key="index">
        <PaginationListItem
          v-if="item.type === 'page'"
          class="clv-pagination__button"
          :value="item.value"
          :aria-label="`Page ${item.value}`"
        >
          {{ item.value }}
        </PaginationListItem>
        <PaginationEllipsis v-else class="clv-pagination__ellipsis">…</PaginationEllipsis>
      </template>
      <PaginationNext class="clv-pagination__button" :aria-label="nextLabel">›</PaginationNext>
      <PaginationLast v-if="showEdges" class="clv-pagination__button" aria-label="Last page">
        »
      </PaginationLast>
    </PaginationList>
  </PaginationRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

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
</style>
