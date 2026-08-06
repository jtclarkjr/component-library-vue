<script setup lang="ts">
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import { useClvComponent } from '../../headless'
import type { CollapsiblePartContext, CollapsibleParts } from '../../parts'

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(
  defineProps<{
    title?: string
    disabled?: boolean
    unstyled?: boolean
    parts?: CollapsibleParts
  }>(),
  { disabled: false },
)

const { classes, part, slotContext } = useClvComponent<CollapsiblePartContext>('collapsible', props)
</script>

<template>
  <CollapsibleRoot
    v-model:open="open"
    :class="classes('clv-collapsible')"
    :disabled="disabled"
    v-bind="part('root', { open, disabled })"
  >
    <CollapsibleTrigger
      :class="classes('clv-collapsible__trigger')"
      v-bind="part('trigger', { open, disabled })"
    >
      <slot name="trigger" :open="open" :context="slotContext('trigger', { open, disabled })">
        <span>{{ title }}</span>
        <span
          aria-hidden="true"
          :class="classes('clv-collapsible__chevron')"
          v-bind="part('icon', { open, disabled })"
        >
          <slot
            name="icon"
            :open="open"
            :disabled="disabled"
            :context="slotContext('icon', { open, disabled })"
            >⌄</slot
          >
        </span>
      </slot>
    </CollapsibleTrigger>
    <CollapsibleContent
      :class="classes('clv-collapsible__content')"
      v-bind="part('content', { open, disabled })"
    >
      <div
        :class="classes('clv-collapsible__content-inner')"
        v-bind="part('contentInner', { open, disabled })"
      >
        <slot :context="slotContext('content', { open, disabled })" />
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
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
}
</style>
