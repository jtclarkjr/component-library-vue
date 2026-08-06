<script setup lang="ts">
import { computed } from 'vue'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'

import type { TabItem } from '../../types'
import { useClvComponent } from '../../headless'
import type { TabsPartContext, TabsParts } from '../../parts'

const model = defineModel<string>()
const props = withDefaults(
  defineProps<{
    items: TabItem[]
    orientation?: 'horizontal' | 'vertical'
    activationMode?: 'automatic' | 'manual'
    unstyled?: boolean
    parts?: TabsParts
  }>(),
  { orientation: 'horizontal', activationMode: 'automatic' },
)
const { classes, part, slotContext } = useClvComponent<TabsPartContext>('tabs', props)

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
    :class="classes(['clv-tabs', `clv-tabs--${orientation}`])"
    :orientation="orientation"
    :activation-mode="activationMode"
    v-bind="part('root', { orientation, value: activeValue })"
  >
    <TabsList
      :class="classes('clv-tabs__list')"
      aria-label="Tabs"
      v-bind="part('list', { orientation, value: activeValue })"
    >
      <TabsTrigger
        v-for="(item, index) in items"
        :key="item.value"
        :class="classes('clv-tabs__trigger')"
        :value="item.value"
        :disabled="item.disabled"
        v-bind="
          part('trigger', {
            item,
            index,
            value: item.value,
            disabled: item.disabled,
            orientation,
            open: activeValue === item.value,
          })
        "
      >
        <slot
          name="trigger"
          :item="item"
          :active="activeValue === item.value"
          :context="
            slotContext('trigger', {
              item,
              index,
              value: item.value,
              disabled: item.disabled,
              orientation,
              open: activeValue === item.value,
            })
          "
        >
          {{ item.label }}
        </slot>
      </TabsTrigger>
    </TabsList>
    <div
      :class="classes('clv-tabs__panels')"
      v-bind="part('panels', { orientation, value: activeValue })"
    >
      <TabsContent
        v-for="(item, index) in items"
        :key="item.value"
        :class="classes('clv-tabs__content')"
        :value="item.value"
        v-bind="
          part('panel', {
            item,
            index,
            value: item.value,
            disabled: item.disabled,
            orientation,
            open: activeValue === item.value,
          })
        "
      >
        <slot
          name="panel"
          :item="item"
          :context="
            slotContext('panel', {
              item,
              index,
              value: item.value,
              disabled: item.disabled,
              orientation,
              open: activeValue === item.value,
            })
          "
          >{{ item.content }}</slot
        >
      </TabsContent>
    </div>
  </TabsRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
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
}
</style>
