<script setup lang="ts">
import { computed, useId } from 'vue'
import {
  ListboxContent,
  ListboxItem,
  ListboxItemIndicator,
  ListboxRoot,
  ListboxVirtualizer,
} from 'reka-ui'

import { useClvComponent } from '../../headless'
import type { ListboxPartContext, ListboxParts } from '../../parts'
import type { ChoiceOption, ClvValue } from '../../types'

const model = defineModel<ClvValue | ClvValue[]>()
const props = withDefaults(
  defineProps<{
    id?: string
    options: ChoiceOption[]
    multiple?: boolean
    label?: string
    help?: string
    error?: string
    name?: string
    required?: boolean
    disabled?: boolean
    orientation?: 'horizontal' | 'vertical'
    selectionBehavior?: 'toggle' | 'replace'
    virtualize?: boolean
    estimateSize?: number
    overscan?: number
    emptyText?: string
    unstyled?: boolean
    parts?: ListboxParts
  }>(),
  {
    multiple: false,
    required: false,
    disabled: false,
    orientation: 'vertical',
    selectionBehavior: 'toggle',
    virtualize: false,
    estimateSize: 40,
    overscan: 8,
    emptyText: 'No options available.',
  },
)
const { classes, part, slotContext } = useClvComponent<ListboxPartContext>('listbox', props)

const generatedId = useId()
const listboxId = computed(() => props.id ?? generatedId)
const labelId = computed(() => `${listboxId.value}-label`)
const descriptionId = computed(() =>
  props.help || props.error ? `${listboxId.value}-description` : undefined,
)
function selected(value: ClvValue) {
  return Array.isArray(model.value) ? model.value.includes(value) : model.value === value
}
</script>

<template>
  <div
    :class="classes('clv-listbox-field')"
    v-bind="part('root', { disabled, invalid: Boolean(error), orientation })"
  >
    <span
      v-if="label"
      :id="labelId"
      :class="classes('clv-listbox-field__label')"
      v-bind="part('label', { disabled, invalid: Boolean(error), orientation })"
      >{{ label }}</span
    >
    <ListboxRoot
      :id="listboxId"
      v-model="model"
      :class="classes('clv-listbox')"
      :multiple="multiple"
      :name="name"
      :required="required"
      :disabled="disabled"
      :orientation="orientation"
      :selection-behavior="selectionBehavior"
      v-bind="part('control', { disabled, invalid: Boolean(error), orientation })"
    >
      <ListboxContent
        :class="classes('clv-listbox__content')"
        :aria-labelledby="label ? labelId : undefined"
        :aria-describedby="descriptionId"
        :aria-invalid="error ? 'true' : undefined"
        v-bind="part('content', { disabled, invalid: Boolean(error), orientation })"
      >
        <p
          v-if="options.length === 0"
          :class="classes('clv-listbox__empty')"
          role="option"
          aria-disabled="true"
          v-bind="part('empty', { disabled, orientation })"
        >
          {{ emptyText }}
        </p>
        <ListboxVirtualizer
          v-else-if="virtualize"
          :options="options"
          :estimate-size="estimateSize"
          :overscan="overscan"
          :text-content="(option) => option.label"
        >
          <template #default="{ option }">
            <ListboxItem
              :class="classes('clv-listbox__item')"
              :value="option.value"
              :disabled="option.disabled"
              :aria-disabled="option.disabled || undefined"
              v-bind="
                part('item', {
                  item: option,
                  index: options.indexOf(option),
                  value: option.value,
                  disabled: disabled || option.disabled,
                  orientation,
                })
              "
            >
              <ListboxItemIndicator
                :class="classes('clv-listbox__indicator')"
                v-bind="
                  part('indicator', {
                    item: option,
                    index: options.indexOf(option),
                    value: option.value,
                    selected: selected(option.value),
                    disabled: disabled || option.disabled,
                    orientation,
                  })
                "
              >
                <slot
                  name="indicator"
                  :option="option"
                  :index="options.indexOf(option)"
                  :selected="selected(option.value)"
                  :disabled="disabled || option.disabled"
                  :orientation="orientation"
                  :context="
                    slotContext('indicator', {
                      item: option,
                      index: options.indexOf(option),
                      value: option.value,
                      selected: selected(option.value),
                      disabled: disabled || option.disabled,
                      orientation,
                    })
                  "
                  >✓</slot
                >
              </ListboxItemIndicator>
              <slot
                name="option"
                :option="option"
                :selected="selected(option.value)"
                :context="
                  slotContext('item', {
                    item: option,
                    index: options.indexOf(option),
                    value: option.value,
                    disabled: disabled || option.disabled,
                    orientation,
                  })
                "
              >
                <span>{{ option.label }}</span>
                <small v-if="option.description">{{ option.description }}</small>
              </slot>
            </ListboxItem>
          </template>
        </ListboxVirtualizer>
        <ListboxItem
          v-for="(option, index) in virtualize ? [] : options"
          :key="option.value"
          :class="classes('clv-listbox__item')"
          :value="option.value"
          :disabled="option.disabled"
          :aria-disabled="option.disabled || undefined"
          v-bind="
            part('item', {
              item: option,
              index,
              value: option.value,
              disabled: disabled || option.disabled,
              orientation,
            })
          "
        >
          <ListboxItemIndicator
            :class="classes('clv-listbox__indicator')"
            v-bind="
              part('indicator', {
                item: option,
                index,
                value: option.value,
                selected: selected(option.value),
                disabled: disabled || option.disabled,
                orientation,
              })
            "
          >
            <slot
              name="indicator"
              :option="option"
              :index="index"
              :selected="selected(option.value)"
              :disabled="disabled || option.disabled"
              :orientation="orientation"
              :context="
                slotContext('indicator', {
                  item: option,
                  index,
                  value: option.value,
                  selected: selected(option.value),
                  disabled: disabled || option.disabled,
                  orientation,
                })
              "
              >✓</slot
            >
          </ListboxItemIndicator>
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
              })
            "
          >
            <span>{{ option.label }}</span>
            <small v-if="option.description">{{ option.description }}</small>
          </slot>
        </ListboxItem>
      </ListboxContent>
    </ListboxRoot>
    <span
      v-if="help || error"
      :id="descriptionId"
      :class="classes({ 'clv-listbox-field__error': error })"
      v-bind="part('description', { disabled, invalid: Boolean(error), orientation })"
    >
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-listbox-field {
    @include field-stack;
    &__label {
      @include field-label;
    }
    &__error {
      color: var(--clv-color-danger);
    }
  }
  .clv-listbox {
    @include field;
    min-height: 5rem;
    padding: var(--clv-space-1);
    &:focus-visible {
      @include focus-ring;
    }
    &[data-disabled] {
      @include disabled;
    }
    &__content {
      max-height: 18rem;
      overflow: auto;
    }
    &__item {
      @include menu-item;
      position: relative;
      padding-left: 2rem;
    }
    &__item small {
      display: block;
      color: var(--clv-color-text-muted);
    }
    &__indicator {
      position: absolute;
      left: 0.65rem;
      color: var(--clv-color-primary);
    }
    &__empty {
      margin: 0;
      padding: var(--clv-space-4);
      color: var(--clv-color-text-muted);
    }
  }
}
</style>
