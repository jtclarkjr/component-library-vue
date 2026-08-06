<script setup lang="ts">
import { computed, useId } from 'vue'
import { CheckboxIndicator, CheckboxRoot, type CheckboxCheckedState } from 'reka-ui'
import { useClvComponent } from '../../headless'
import type { CheckboxPartContext, CheckboxParts } from '../../parts'

const model = defineModel<CheckboxCheckedState>({ default: false })
const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    help?: string
    error?: string
    name?: string
    value?: string
    required?: boolean
    disabled?: boolean
    unstyled?: boolean
    parts?: CheckboxParts
  }>(),
  { required: false, disabled: false },
)

const generatedId = useId()
const controlId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() =>
  props.help || props.error ? `${controlId.value}-description` : undefined,
)
const { classes, part, slotContext } = useClvComponent<CheckboxPartContext>('checkbox', props)
</script>

<template>
  <div
    :class="classes('clv-checkbox-field')"
    v-bind="part('root', { disabled, required, invalid: Boolean(error) })"
  >
    <div :class="classes('clv-checkbox-field__control')">
      <CheckboxRoot
        :class="classes('clv-checkbox')"
        v-bind="part('control', { disabled, required, invalid: Boolean(error), checked: model })"
        :id="controlId"
        v-model="model"
        :name="name"
        :value="value"
        :required="required"
        :disabled="disabled"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="descriptionId"
      >
        <CheckboxIndicator
          :class="classes('clv-checkbox__indicator')"
          v-bind="part('indicator', { disabled, checked: model })"
        >
          <slot
            name="indicator"
            :checked="model"
            :indeterminate="model === 'indeterminate'"
            :disabled="disabled"
            :context="slotContext('indicator', { disabled, checked: model })"
          >
            {{ model === 'indeterminate' ? '−' : '✓' }}
          </slot>
        </CheckboxIndicator>
      </CheckboxRoot>
      <label
        v-if="label || $slots.default"
        :for="controlId"
        :class="classes('clv-checkbox-field__label')"
        v-bind="part('label', { disabled, checked: model })"
      >
        <slot :context="slotContext('label', { disabled, checked: model })">{{ label }}</slot>
      </label>
    </div>
    <span
      v-if="help || error"
      :id="descriptionId"
      :class="classes({ 'clv-checkbox-field__error': error })"
      v-bind="part('description', { disabled, invalid: Boolean(error) })"
    >
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-checkbox-field {
    display: grid;
    gap: var(--clv-space-2);
    color: var(--clv-color-text-muted);
    font-family: var(--clv-font-sans);
    font-size: 0.875rem;

    &__control {
      display: flex;
      align-items: flex-start;
      gap: var(--clv-space-3);
    }

    &__label {
      padding-top: 0.15rem;
      color: var(--clv-color-text);
      cursor: pointer;
      font-weight: 700;
    }

    &__error {
      color: var(--clv-color-danger);
    }
  }

  .clv-checkbox {
    display: inline-flex;
    width: 1.35rem;
    height: 1.35rem;
    align-items: center;
    justify-content: center;
    flex: none;
    border: 1px solid var(--clv-color-border);
    border-radius: 0.35rem;
    background: var(--clv-color-bg);
    color: #06231b;
    cursor: pointer;

    &:focus-visible {
      @include focus-ring;
    }

    &:disabled {
      @include disabled;
    }

    &[data-state='checked'],
    &[data-state='indeterminate'] {
      border-color: var(--clv-color-primary);
      background: var(--clv-color-primary);
    }

    &__indicator {
      font-size: 0.9rem;
      font-weight: 900;
      line-height: 1;
    }
  }
}
</style>
