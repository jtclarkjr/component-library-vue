<script setup lang="ts">
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'

const open = defineModel<boolean>('open', { default: false })

withDefaults(
  defineProps<{
    title?: string
    disabled?: boolean
  }>(),
  { disabled: false },
)
</script>

<template>
  <CollapsibleRoot v-model:open="open" class="clv-collapsible" :disabled="disabled">
    <CollapsibleTrigger class="clv-collapsible__trigger">
      <slot name="trigger" :open="open">
        <span>{{ title }}</span>
        <span aria-hidden="true" class="clv-collapsible__chevron">⌄</span>
      </slot>
    </CollapsibleTrigger>
    <CollapsibleContent class="clv-collapsible__content">
      <div class="clv-collapsible__content-inner"><slot /></div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-collapsible {
  width: 100%;
  border: 1px solid var(--clv-color-border);
  border-radius: var(--clv-radius-md);
  background: var(--clv-color-surface);
  color: var(--clv-color-text);
  font-family: var(--clv-font-sans);

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

    &[data-state='open'] .clv-collapsible__chevron {
      transform: rotate(180deg);
    }
  }

  &__chevron {
    transition: transform var(--clv-motion-fast) ease;
  }

  &__content {
    overflow: hidden;
    color: var(--clv-color-text-muted);
  }

  &__content-inner {
    padding: 0 var(--clv-space-4) var(--clv-space-4);
  }
}
</style>
