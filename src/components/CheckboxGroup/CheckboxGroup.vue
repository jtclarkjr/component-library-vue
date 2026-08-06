<script setup lang="ts">
import { computed, useId } from 'vue'
import { CheckboxGroupRoot, CheckboxIndicator, CheckboxRoot } from 'reka-ui'

import { useClvComponent } from '../../headless'
import type { CheckboxGroupPartContext, CheckboxGroupParts } from '../../parts'
import type { ChoiceOption, ClvValue } from '../../types'

const model = defineModel<ClvValue[]>({ default: () => [] })
const props = withDefaults(
  defineProps<{
    id?: string
    options: ChoiceOption[]
    label?: string
    help?: string
    error?: string
    name?: string
    required?: boolean
    disabled?: boolean
    orientation?: 'horizontal' | 'vertical'
    unstyled?: boolean
    parts?: CheckboxGroupParts
  }>(),
  { required: false, disabled: false, orientation: 'vertical' },
)

const generatedId = useId()
const groupId = computed(() => props.id ?? generatedId)
const labelId = computed(() => `${groupId.value}-label`)
const descriptionId = computed(() =>
  props.help || props.error ? `${groupId.value}-description` : undefined,
)
const { classes, part, slotContext } = useClvComponent<CheckboxGroupPartContext>(
  'checkbox-group',
  props,
)
</script>

<template>
  <fieldset
    :class="classes('clv-checkbox-group-field')"
    v-bind="part('root', { disabled, required, orientation, invalid: Boolean(error) })"
    :disabled="disabled"
  >
    <legend
      v-if="label"
      :id="labelId"
      :class="classes('clv-checkbox-group-field__label')"
      v-bind="part('label', { disabled, orientation })"
    >
      {{ label }}
    </legend>
    <CheckboxGroupRoot
      :id="groupId"
      v-model="model"
      :class="classes(['clv-checkbox-group', `clv-checkbox-group--${orientation}`])"
      v-bind="part('group', { disabled, required, orientation, invalid: Boolean(error) })"
      :name="name"
      :required="required"
      :disabled="disabled"
      :orientation="orientation"
      :aria-labelledby="label ? labelId : undefined"
      :aria-describedby="descriptionId"
      :aria-invalid="error ? 'true' : undefined"
    >
      <label
        v-for="(option, index) in options"
        :key="option.value"
        :class="classes('clv-checkbox-group__option')"
        v-bind="
          part('option', {
            option,
            index,
            selected: model.includes(option.value),
            disabled: disabled || option.disabled,
          })
        "
      >
        <CheckboxRoot
          :class="classes('clv-checkbox-group__control')"
          v-bind="
            part('control', {
              option,
              index,
              selected: model.includes(option.value),
              disabled: disabled || option.disabled,
            })
          "
          :value="option.value"
          :disabled="disabled || option.disabled"
        >
          <CheckboxIndicator
            :class="classes('clv-checkbox-group__indicator')"
            v-bind="
              part('indicator', {
                option,
                index,
                selected: model.includes(option.value),
                disabled: disabled || option.disabled,
                orientation,
              })
            "
          >
            <slot
              name="indicator"
              :option="option"
              :index="index"
              :selected="model.includes(option.value)"
              :disabled="disabled || option.disabled"
              :orientation="orientation"
              :context="
                slotContext('indicator', {
                  option,
                  index,
                  selected: model.includes(option.value),
                  disabled: disabled || option.disabled,
                  orientation,
                })
              "
              >✓</slot
            >
          </CheckboxIndicator>
        </CheckboxRoot>
        <slot
          name="option"
          :option="option"
          :selected="model.includes(option.value)"
          :context="
            slotContext('option', {
              option,
              index,
              selected: model.includes(option.value),
              disabled: disabled || option.disabled,
              orientation,
            })
          "
        >
          <span :data-selected="model.includes(option.value) || undefined">
            {{ option.label }}
            <small v-if="option.description">{{ option.description }}</small>
          </span>
        </slot>
      </label>
    </CheckboxGroupRoot>
    <span
      v-if="help || error"
      :id="descriptionId"
      :class="classes({ 'clv-checkbox-group-field__error': error })"
      v-bind="part('description', { disabled, invalid: Boolean(error), orientation })"
    >
      {{ error ?? help }}
    </span>
  </fieldset>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-checkbox-group-field {
    @include field-stack;
    min-width: 0;
    padding: 0;
    border: 0;

    &__label {
      @include field-label;
      margin-bottom: var(--clv-space-2);
    }
    &__error {
      color: var(--clv-color-danger);
    }
  }

  .clv-checkbox-group {
    display: flex;
    gap: var(--clv-space-3);
    &--vertical {
      flex-direction: column;
    }

    &__option {
      display: flex;
      align-items: flex-start;
      gap: var(--clv-space-2);
      color: var(--clv-color-text);
      cursor: pointer;
    }
    &__option small {
      display: block;
      color: var(--clv-color-text-muted);
    }
    &__control {
      display: grid;
      width: 1.25rem;
      height: 1.25rem;
      flex: 0 0 auto;
      place-items: center;
      border: 1px solid var(--clv-color-border);
      border-radius: 0.3rem;
      background: var(--clv-color-bg);
      color: var(--clv-color-bg);
      &:focus-visible {
        @include focus-ring;
      }
      &[data-state='checked'] {
        border-color: var(--clv-color-primary);
        background: var(--clv-color-primary);
      }
      &[data-disabled] {
        @include disabled;
      }
    }
    &__indicator {
      font-size: 0.8rem;
      font-weight: 900;
    }
  }
}
</style>
