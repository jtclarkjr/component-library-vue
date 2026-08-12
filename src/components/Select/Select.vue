<script setup lang="ts" generic="T extends ClvValue = ClvValue">
import { computed, ref, toRef, useAttrs, useId, useSlots } from 'vue'
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'

import { useClvComponent } from '../../headless'
import type { ClvButtonAttrs, SelectPartContext, SelectParts } from '../../parts'
import type { ChoiceOption, ClvValue } from '../../types'

defineOptions({ inheritAttrs: false })

const model = defineModel<T>()
const props = withDefaults(
  defineProps<{
    id?: string
    options: ChoiceOption<T>[]
    label?: string
    help?: string
    error?: string
    placeholder?: string
    name?: string
    required?: boolean
    disabled?: boolean
    triggerAttrs?: ClvButtonAttrs
    unstyled?: boolean
    parts?: SelectParts<T>
  }>(),
  {
    placeholder: 'Select an option',
    required: false,
    disabled: false,
    unstyled: undefined,
    parts: undefined,
  },
)

const attrs = useAttrs()
const slots = useSlots()
const clv = useClvComponent<SelectPartContext<T>>('select', {
  attrs,
  parts: toRef(props, 'parts'),
  unstyled: toRef(props, 'unstyled'),
})
const generatedId = useId()
const open = ref(false)
const controlId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() =>
  props.help || props.error ? `${controlId.value}-description` : undefined,
)
const accessibleLabel = computed(() =>
  typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : undefined,
)
const selectedOption = computed(() => props.options.find((option) => option.value === model.value))
const context = computed(() => ({
  disabled: props.disabled,
  invalid: Boolean(props.error),
  open: open.value,
  value: model.value,
}))

const rootAttrs = computed(() =>
  clv.part('root', context.value, {
    class: 'clv-select-field',
    'data-disabled': props.disabled ? '' : undefined,
    'data-invalid': props.error ? '' : undefined,
  }),
)
const labelAttrs = computed(() =>
  clv.part(
    'label',
    context.value,
    {
      class: props.label ? 'clv-select-field__label' : 'clv-select-field__sr-only',
      for: controlId.value,
    },
    { protected: ['for'] },
  ),
)
const controlAttrs = computed(() =>
  clv.part(
    'control',
    context.value,
    {
      id: controlId.value,
      class: 'clv-select',
      'aria-invalid': props.error ? 'true' : undefined,
      'aria-describedby': descriptionId.value,
    },
    {
      consumerAttrs: props.triggerAttrs,
      protected: ['id', 'aria-invalid', 'aria-describedby'],
    },
  ),
)
const contentAttrs = computed(() =>
  clv.part(
    'content',
    context.value,
    { class: 'clv-select-content' },
    { surface: true, detached: true },
  ),
)
const descriptionAttrs = computed(() =>
  clv.part(
    'description',
    context.value,
    {
      id: descriptionId.value,
      class: ['clv-select-field__description', props.error && 'clv-select-field__error'],
    },
    { protected: ['id'] },
  ),
)
</script>

<template>
  <div v-bind="rootAttrs">
    <label v-if="label || accessibleLabel" v-bind="labelAttrs">
      {{ label ?? accessibleLabel }}
    </label>
    <SelectRoot
      v-model="model"
      v-model:open="open"
      :name="name"
      :required="required"
      :disabled="disabled"
    >
      <SelectTrigger v-bind="controlAttrs">
        <SelectValue v-bind="clv.part('value', context)" :placeholder="placeholder">
          <slot
            name="value"
            :value="model"
            :option="selectedOption"
            :context="clv.slotContext('value', context)"
          >
            {{ selectedOption?.label }}
          </slot>
        </SelectValue>
        <SelectIcon
          v-bind="
            clv.part(
              'icon',
              context,
              {
                class: ['clv-select__icon', !slots['trigger-icon'] && 'clv-select__icon--default'],
                'aria-hidden': 'true',
              },
              { protected: ['aria-hidden'] },
            )
          "
        >
          <slot
            name="trigger-icon"
            :open="open"
            :disabled="disabled"
            :value="model"
            :option="selectedOption"
            :context="clv.slotContext('icon', context)"
            >⌄</slot
          >
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal>
        <SelectContent v-bind="contentAttrs" position="popper" :side-offset="6">
          <SelectViewport
            v-bind="clv.part('viewport', context, { class: 'clv-select-content__viewport' })"
          >
            <SelectItem
              v-for="(option, index) in options"
              :key="option.value"
              v-bind="
                clv.part(
                  'item',
                  { ...context, option, index, value: option.value, disabled: option.disabled },
                  { class: 'clv-select-content__item' },
                )
              "
              :value="option.value"
              :disabled="option.disabled"
            >
              <SelectItemText>
                <slot
                  name="option"
                  :option="option"
                  :context="
                    clv.slotContext('item', {
                      ...context,
                      option,
                      index,
                      value: option.value,
                      disabled: option.disabled,
                    })
                  "
                >
                  {{ option.label }}
                </slot>
              </SelectItemText>
              <SelectItemIndicator
                v-bind="
                  clv.part(
                    'indicator',
                    {
                      ...context,
                      option,
                      index,
                      value: option.value,
                      selected: option.value === model,
                      disabled: disabled || option.disabled,
                    },
                    { class: 'clv-select-content__indicator' },
                  )
                "
              >
                <slot
                  name="indicator"
                  :option="option"
                  :index="index"
                  :selected="option.value === model"
                  :disabled="disabled || option.disabled"
                  :value="option.value"
                  :context="
                    clv.slotContext('indicator', {
                      ...context,
                      option,
                      index,
                      value: option.value,
                      selected: option.value === model,
                      disabled: disabled || option.disabled,
                    })
                  "
                  >✓</slot
                >
              </SelectItemIndicator>
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
    <span v-if="help || error" v-bind="descriptionAttrs">{{ error ?? help }}</span>
  </div>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-select-field {
    display: grid;
    gap: var(--clv-select-gap);
    color: var(--clv-color-text-muted);
    font-family: var(--clv-font-sans);
    font-size: var(--clv-font-size-body-sm);

    &__label {
      color: var(--clv-color-text);
      font-weight: var(--clv-select-label-weight);
    }

    &__sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    &__description {
      color: var(--clv-color-text-muted);
      font-size: var(--clv-font-size-sm);
    }

    &__error {
      color: var(--clv-color-danger);
    }
  }

  .clv-select {
    @include field;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: var(--clv-space-3);
    padding: var(--clv-select-padding);
    border-width: var(--clv-select-border-width);
    border-radius: var(--clv-select-radius);
    background: var(--clv-select-bg);
    cursor: pointer;
    font-size: var(--clv-select-font-size);
    text-align: left;
    transition: border-color var(--clv-motion-fast) var(--clv-motion-easing-standard);

    &:focus-visible {
      border-color: var(--clv-color-primary);
      outline: var(--clv-select-focus-width) solid var(--clv-color-focus);
    }

    &:disabled {
      @include disabled;
    }

    &[data-placeholder] {
      color: var(--clv-color-text-muted);
    }

    &__icon {
      flex: 0 0 auto;
      color: var(--clv-color-text-muted);
    }

    &__icon--default:not([data-clv-unstyled]) {
      width: var(--clv-select-icon-size);
      height: var(--clv-select-icon-size);
      border-right: var(--clv-select-icon-stroke-width) solid currentcolor;
      border-bottom: var(--clv-select-icon-stroke-width) solid currentcolor;
      font-size: var(--clv-select-icon-font-size);
      line-height: var(--clv-select-icon-line-height);
      transform: var(--clv-select-icon-transform);
    }
  }
}
</style>
