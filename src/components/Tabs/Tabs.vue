<script setup lang="ts">
import { computed } from 'vue'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'

import type { TabItem } from '../../types'

const model = defineModel<string>()
const props = withDefaults(
  defineProps<{
    items: TabItem[]
    orientation?: 'horizontal' | 'vertical'
    activationMode?: 'automatic' | 'manual'
  }>(),
  { orientation: 'horizontal', activationMode: 'automatic' },
)

const activeValue = computed({
  get: () => model.value ?? props.items.find((item) => !item.disabled)?.value,
  set: (value: string | undefined) => {
    model.value = value
  },
})
</script>

<template>
  <TabsRoot
    v-model="activeValue"
    class="clv-tabs"
    :class="`clv-tabs--${orientation}`"
    :orientation="orientation"
    :activation-mode="activationMode"
  >
    <TabsList class="clv-tabs__list" aria-label="Tabs">
      <TabsTrigger
        v-for="item in items"
        :key="item.value"
        class="clv-tabs__trigger"
        :value="item.value"
        :disabled="item.disabled"
      >
        <slot name="trigger" :item="item" :active="activeValue === item.value">
          {{ item.label }}
        </slot>
      </TabsTrigger>
    </TabsList>
    <div class="clv-tabs__panels">
      <TabsContent
        v-for="item in items"
        :key="item.value"
        class="clv-tabs__content"
        :value="item.value"
      >
        <slot name="panel" :item="item">{{ item.content }}</slot>
      </TabsContent>
    </div>
  </TabsRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-tabs {
  display: flex;
  width: 100%;
  color: var(--clv-color-text);
  font-family: var(--clv-font-sans);

  &--horizontal {
    flex-direction: column;
  }

  &--vertical {
    flex-direction: row;
    gap: var(--clv-space-4);
  }

  &__list {
    display: flex;
    border-bottom: 1px solid var(--clv-color-border);
  }

  &--vertical &__list {
    flex-direction: column;
    border-right: 1px solid var(--clv-color-border);
    border-bottom: 0;
  }

  &__trigger {
    padding: 0.7rem 1rem;
    border: 0;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: var(--clv-color-text-muted);
    cursor: pointer;
    font: inherit;
    font-weight: 750;

    &[data-state='active'] {
      border-color: var(--clv-color-primary);
      color: var(--clv-color-text);
    }

    &:focus-visible {
      @include focus-ring;
    }

    &:disabled {
      @include disabled;
    }
  }

  &--vertical &__trigger {
    border-right: 2px solid transparent;
    border-bottom: 0;
  }

  &__panels {
    flex: 1;
  }

  &__content {
    padding: var(--clv-space-4);
    color: var(--clv-color-text-muted);

    &:focus-visible {
      @include focus-ring;
    }
  }
}
</style>
