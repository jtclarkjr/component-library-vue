<script setup lang="ts">
import { computed, useId } from 'vue'
import {
  EditableArea,
  EditableCancelTrigger,
  EditableEditTrigger,
  EditableInput,
  EditablePreview,
  EditableRoot,
  EditableSubmitTrigger,
} from 'reka-ui'
import { useClvComponent } from '../../headless'
import type { EditablePartContext, EditableParts } from '../../parts'

const model = defineModel<string | null>({ default: '' })
const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    help?: string
    error?: string
    placeholder?: string | { edit: string; preview: string }
    name?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    activationMode?: 'focus' | 'dblclick' | 'none'
    submitMode?: 'blur' | 'enter' | 'none' | 'both'
    startWithEditMode?: boolean
    selectOnFocus?: boolean
    maxLength?: number
    unstyled?: boolean
    parts?: EditableParts
  }>(),
  {
    placeholder: 'Click to edit',
    required: false,
    disabled: false,
    readonly: false,
    activationMode: 'dblclick',
    submitMode: 'both',
    startWithEditMode: false,
    selectOnFocus: true,
  },
)
const emit = defineEmits<{
  submit: [value: string | null | undefined]
  stateChange: [state: 'edit' | 'submit' | 'cancel']
}>()

const generatedId = useId()
const controlId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() =>
  props.help || props.error ? `${controlId.value}-description` : undefined,
)
const { classes, part, slotContext } = useClvComponent<EditablePartContext>('editable', props)
</script>

<template>
  <div
    :class="classes('clv-editable-field')"
    v-bind="part('root', { disabled, readonly, required, invalid: Boolean(error), value: model })"
  >
    <label
      v-if="label"
      :class="classes('clv-editable-field__label')"
      :for="controlId"
      v-bind="part('label', { disabled, readonly, invalid: Boolean(error), value: model })"
      >{{ label }}</label
    >
    <EditableRoot
      v-slot="state"
      v-model="model"
      :class="classes('clv-editable')"
      :id="controlId"
      :name="name"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      :activation-mode="activationMode"
      :submit-mode="submitMode"
      :start-with-edit-mode="startWithEditMode"
      :select-on-focus="selectOnFocus"
      :max-length="maxLength"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="descriptionId"
      @submit="emit('submit', $event)"
      @update:state="emit('stateChange', $event)"
      v-bind="
        part('control', { disabled, readonly, required, invalid: Boolean(error), value: model })
      "
    >
      <EditableArea
        :class="classes('clv-editable__area')"
        v-bind="
          part('area', { ...state, disabled, readonly, invalid: Boolean(error), value: model })
        "
      >
        <EditablePreview
          :class="classes('clv-editable__preview')"
          v-bind="part('preview', { ...state, disabled, readonly, value: model })"
        >
          <slot
            name="preview"
            v-bind="state"
            :context="slotContext('preview', { ...state, disabled, readonly, value: model })"
            >{{ model }}</slot
          >
        </EditablePreview>
        <EditableInput
          :class="classes('clv-editable__input')"
          :aria-label="label"
          v-bind="
            part('input', {
              ...state,
              disabled,
              readonly,
              required,
              invalid: Boolean(error),
              value: model,
            })
          "
        >
          <slot
            name="input"
            v-bind="state"
            :context="slotContext('input', { ...state, disabled, readonly, value: model })"
          />
        </EditableInput>
      </EditableArea>
      <div
        :class="classes('clv-editable__actions')"
        v-bind="part('actions', { ...state, disabled, readonly, value: model })"
      >
        <slot
          name="actions"
          v-bind="state"
          :context="slotContext('actions', { ...state, disabled, readonly, value: model })"
        >
          <EditableEditTrigger
            v-if="!state.isEditing && !readonly"
            :class="classes('clv-editable__button')"
            v-bind="part('edit', { ...state, disabled, readonly, value: model })"
            >Edit</EditableEditTrigger
          >
          <template v-else-if="state.isEditing">
            <EditableSubmitTrigger
              :class="classes('clv-editable__button clv-editable__button--primary')"
              aria-label="Save changes"
              v-bind="part('submit', { ...state, disabled, readonly, value: model })"
              >Save</EditableSubmitTrigger
            >
            <EditableCancelTrigger
              :class="classes('clv-editable__button')"
              aria-label="Cancel changes"
              v-bind="part('cancel', { ...state, disabled, readonly, value: model })"
            >
              Cancel
            </EditableCancelTrigger>
          </template>
        </slot>
      </div>
    </EditableRoot>
    <span
      v-if="help || error"
      :id="descriptionId"
      :class="classes({ 'clv-editable-field__error': error })"
      v-bind="part('description', { disabled, readonly, invalid: Boolean(error), value: model })"
    >
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-editable-field {
    @include field-stack;
    &__label {
      @include field-label;
    }
    &__error {
      color: var(--clv-color-danger);
    }
  }
  .clv-editable {
    display: flex;
    align-items: center;
    gap: var(--clv-space-2);
    &__area {
      @include field;
      display: grid;
      flex: 1;
      padding: 0.65rem 0.8rem;
    }
    &__preview,
    &__input {
      grid-area: 1 / 1;
      color: var(--clv-color-text);
      font: inherit;
    }
    &__input {
      width: 100%;
      border: 0;
      outline: 0;
      background: transparent;
    }
    &__area:focus-within {
      @include focus-ring;
    }
    &__actions {
      display: flex;
      gap: var(--clv-space-1);
    }
    &__button {
      padding: 0.55rem 0.7rem;
      border: 1px solid var(--clv-color-border);
      border-radius: var(--clv-radius-sm);
      background: var(--clv-color-surface);
      color: var(--clv-color-text);
      cursor: pointer;
    }
    &__button:focus-visible {
      @include focus-ring;
    }
    &__button--primary {
      border-color: var(--clv-color-primary);
      color: var(--clv-color-primary);
    }
  }
}
</style>
