<script setup lang="ts">
import { computed, useId } from 'vue'
import { ColorFieldInput, ColorFieldRoot, ColorSwatch } from 'reka-ui'

import { useClvComponent } from '../../headless'
import type { ColorFieldPartContext, ColorFieldParts } from '../../parts'
import type { ClvColorChannel, ClvColorSpace } from '../../types'
import { normalizeCssColor } from '../_shared/color'

const model = defineModel<string>({ default: '#74e0c1' })
const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    help?: string
    error?: string
    name?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    colorSpace?: ClvColorSpace
    channel?: ClvColorChannel
    placeholder?: string
    locale?: string
    step?: number
    disableWheelChange?: boolean
    showPreview?: boolean
    unstyled?: boolean
    parts?: ColorFieldParts
  }>(),
  {
    label: 'Color',
    required: false,
    disabled: false,
    readonly: false,
    colorSpace: 'rgb',
    placeholder: '#000000',
    locale: 'en-US',
    disableWheelChange: false,
    showPreview: true,
  },
)
const emit = defineEmits<{ change: [value: string]; commit: [value: string] }>()

const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() =>
  props.help || props.error ? `${inputId.value}-description` : undefined,
)
const { classes, part, slotContext } = useClvComponent<ColorFieldPartContext>('color-field', props)

function update(value: string) {
  const normalized = normalizeCssColor(value)
  model.value = normalized
  emit('change', normalized)
}

function commit() {
  emit('commit', normalizeCssColor(model.value))
}
</script>

<template>
  <div
    :class="classes('clv-color-field')"
    v-bind="
      part('root', {
        disabled,
        readonly,
        required,
        invalid: Boolean(error),
        value: model,
        colorSpace,
        channel,
      })
    "
    :data-invalid="error ? '' : undefined"
  >
    <label
      v-if="label"
      :class="classes('clv-color-field__label')"
      v-bind="part('label', { disabled, readonly, invalid: Boolean(error) })"
      :for="inputId"
      >{{ label }}</label
    >
    <ColorFieldRoot
      :class="classes('clv-color-field__control')"
      @update:model-value="update"
      v-bind="
        part('control', {
          disabled,
          readonly,
          required,
          invalid: Boolean(error),
          value: model,
          colorSpace,
          channel,
        })
      "
      :model-value="model"
      :color-space="colorSpace"
      :channel="channel"
      :name="name"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      :locale="locale"
      :step="step"
      :disable-wheel-change="disableWheelChange"
    >
      <slot
        name="preview"
        :value="model"
        :context="slotContext('preview', { disabled, readonly, value: model })"
      >
        <span
          v-if="showPreview"
          :class="classes('clv-color-field__preview')"
          v-bind="part('preview', { disabled, readonly, value: model })"
        >
          <ColorSwatch :color="model" :label="`${label} preview`" />
        </span>
      </slot>
      <slot
        name="input"
        :value="model"
        :context="
          slotContext('input', { disabled, readonly, invalid: Boolean(error), value: model })
        "
      >
        <ColorFieldInput
          :class="classes('clv-color-field__input')"
          @change="commit"
          @blur="commit"
          v-bind="
            part('input', { disabled, readonly, required, invalid: Boolean(error), value: model })
          "
          :id="inputId"
          :aria-invalid="error ? 'true' : undefined"
          :aria-describedby="descriptionId"
        />
      </slot>
    </ColorFieldRoot>
    <span
      v-if="help || error"
      :id="descriptionId"
      :class="classes({ 'clv-color-field__error': error })"
      v-bind="part('description', { disabled, readonly, invalid: Boolean(error) })"
    >
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-color-field {
    @include field-stack;

    &__label {
      @include field-label;
    }

    &__control {
      @include field;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: center;
      overflow: hidden;
    }

    &__control:focus-within {
      @include focus-ring;
    }

    &__preview {
      @include checkerboard;
      display: grid;
      width: 2.5rem;
      height: 100%;
      min-height: var(--clv-control-height);
      place-items: center;
      border-right: 1px solid var(--clv-color-border);
    }

    &__preview :deep([role='img']) {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: var(--clv-radius-sm);
    }

    &__input {
      min-width: 0;
      border: 0;
      outline: 0;
      background: transparent;
      padding: 0.625rem 0.75rem;
      color: var(--clv-color-text);
      font: inherit;
      font-variant-numeric: tabular-nums;
    }

    &__control[data-disabled] {
      @include disabled;
    }

    &__error {
      color: var(--clv-color-danger);
    }
  }
}
</style>
