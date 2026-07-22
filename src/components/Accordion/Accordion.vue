<script setup lang="ts">
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem as AccordionItemPrimitive,
  AccordionRoot,
  AccordionTrigger,
} from 'reka-ui'

import type { AccordionItem } from '../../types'

const model = defineModel<string | string[]>()

const props = withDefaults(
  defineProps<{
    items: AccordionItem[]
    type?: 'single' | 'multiple'
    collapsible?: boolean
    disabled?: boolean
  }>(),
  { type: 'single', collapsible: true, disabled: false },
)

function isOpen(value: string) {
  return Array.isArray(model.value) ? model.value.includes(value) : model.value === value
}
</script>

<template>
  <AccordionRoot
    v-model="model"
    class="clv-accordion"
    :type="props.type"
    :collapsible="collapsible"
    :disabled="disabled"
  >
    <AccordionItemPrimitive
      v-for="item in items"
      :key="item.value"
      class="clv-accordion__item"
      :value="item.value"
      :disabled="item.disabled"
    >
      <AccordionHeader class="clv-accordion__header">
        <AccordionTrigger class="clv-accordion__trigger">
          <slot name="trigger" :item="item" :open="isOpen(item.value)">
            <span>{{ item.title }}</span>
            <span aria-hidden="true" class="clv-accordion__chevron">⌄</span>
          </slot>
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent class="clv-accordion__content">
        <div class="clv-accordion__content-inner">
          <slot name="content" :item="item">{{ item.content }}</slot>
        </div>
      </AccordionContent>
    </AccordionItemPrimitive>
  </AccordionRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-accordion {
  width: 100%;
  border: 1px solid var(--clv-color-border);
  border-radius: var(--clv-radius-md);
  background: var(--clv-color-surface);
  color: var(--clv-color-text);
  font-family: var(--clv-font-sans);

  &__item + &__item {
    border-top: 1px solid var(--clv-color-border);
  }

  &__header {
    margin: 0;
  }

  &__trigger {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: var(--clv-space-4);
    padding: var(--clv-space-4);
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font: inherit;
    font-weight: 750;
    text-align: left;

    &:focus-visible {
      @include focus-ring;
    }

    &:disabled {
      @include disabled;
    }

    &[data-state='open'] .clv-accordion__chevron {
      transform: rotate(180deg);
    }
  }

  &__chevron {
    transition: transform var(--clv-motion-fast) ease;
  }

  &__content {
    overflow: hidden;
    color: var(--clv-color-text-muted);

    &[data-state='open'] {
      animation: clv-accordion-open var(--clv-motion-medium) ease-out;
    }
  }

  &__content-inner {
    padding: 0 var(--clv-space-4) var(--clv-space-4);
  }
}

@keyframes clv-accordion-open {
  from {
    opacity: 0;
    transform: translateY(-0.25rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .clv-accordion__content {
    animation: none !important;
  }
}
</style>
