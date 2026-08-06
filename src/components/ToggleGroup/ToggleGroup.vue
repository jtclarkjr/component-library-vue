<script setup lang="ts">
import { computed, useId } from 'vue'
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'

import { useClvComponent } from '../../headless'
import type { ToggleGroupPartContext, ToggleGroupParts } from '../../parts'
import type { ChoiceOption, ClvValue } from '../../types'

const model = defineModel<ClvValue | ClvValue[]>()
const props = withDefaults(
  defineProps<{
    id?: string
    options: ChoiceOption[]
    type?: 'single' | 'multiple'
    label?: string
    name?: string
    required?: boolean
    disabled?: boolean
    orientation?: 'horizontal' | 'vertical'
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'outline'
    loop?: boolean
    unstyled?: boolean
    parts?: ToggleGroupParts
  }>(),
  {
    type: 'single',
    required: false,
    disabled: false,
    orientation: 'horizontal',
    size: 'md',
    variant: 'default',
    loop: true,
  },
)
const { classes, part, slotContext } = useClvComponent<ToggleGroupPartContext>(
  'toggle-group',
  props,
)

const generatedId = useId()
const groupId = computed(() => props.id ?? generatedId)
const labelId = computed(() => `${groupId.value}-label`)
function selected(value: ClvValue) {
  return Array.isArray(model.value) ? model.value.includes(value) : model.value === value
}
</script>

<template>
  <div
    :class="classes('clv-toggle-group-field')"
    v-bind="part('root', { disabled, orientation, size, variant })"
  >
    <span
      v-if="label"
      :id="labelId"
      :class="classes('clv-toggle-group-field__label')"
      v-bind="part('label', { disabled, orientation, size, variant })"
      >{{ label }}</span
    >
    <ToggleGroupRoot
      :id="groupId"
      v-model="model"
      :class="
        classes([
          `clv-toggle-group--${orientation}`,
          `clv-toggle-group--${size}`,
          `clv-toggle-group--${variant}`,
          'clv-toggle-group',
        ])
      "
      :type="type"
      :name="name"
      :required="required"
      :disabled="disabled"
      :orientation="orientation"
      :loop="loop"
      :aria-labelledby="label ? labelId : undefined"
      v-bind="part('group', { disabled, orientation, size, variant })"
    >
      <ToggleGroupItem
        v-for="(option, index) in options"
        :key="option.value"
        :class="classes('clv-toggle-group__item')"
        :value="option.value"
        :disabled="option.disabled"
        :aria-label="option.label"
        v-bind="
          part('item', {
            item: option,
            index,
            value: option.value,
            disabled: disabled || option.disabled,
            orientation,
            size,
            variant,
          })
        "
      >
        <slot
          name="option"
          :option="option"
          :selected="selected(option.value)"
          :context="
            slotContext('item', {
              item: option,
              index,
              value: option.value,
              disabled: disabled || option.disabled,
              orientation,
              size,
              variant,
            })
          "
          >{{ option.label }}</slot
        >
      </ToggleGroupItem>
    </ToggleGroupRoot>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-toggle-group-field {
    @include field-stack;
    &__label {
      @include field-label;
    }
  }
  .clv-toggle-group {
    display: inline-flex;
    width: fit-content;
    gap: var(--clv-space-1);
    &--vertical {
      flex-direction: column;
    }
    &__item {
      border: 1px solid transparent;
      border-radius: var(--clv-radius-sm);
      background: var(--clv-color-surface);
      color: var(--clv-color-text-muted);
      cursor: pointer;
      font: inherit;
    }
    &--sm &__item {
      padding: 0.35rem 0.55rem;
      font-size: 0.75rem;
    }
    &--md &__item {
      padding: 0.55rem 0.75rem;
      font-size: 0.875rem;
    }
    &--lg &__item {
      padding: 0.7rem 0.95rem;
      font-size: 1rem;
    }
    &--outline &__item {
      border-color: var(--clv-color-border);
      background: transparent;
    }
    &__item[data-state='on'] {
      border-color: var(--clv-color-primary);
      background: var(--clv-color-selection);
      color: var(--clv-color-primary);
    }
    &__item:focus-visible {
      @include focus-ring;
    }
    &__item[data-disabled] {
      @include disabled;
    }
  }
}
</style>
