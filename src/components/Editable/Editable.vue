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
</script>

<template>
  <div class="clv-editable-field">
    <label v-if="label" class="clv-editable-field__label" :for="controlId">{{ label }}</label>
    <EditableRoot
      v-slot="state"
      v-model="model"
      class="clv-editable"
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
    >
      <EditableArea class="clv-editable__area">
        <EditablePreview class="clv-editable__preview">
          <slot name="preview" v-bind="state">{{ model }}</slot>
        </EditablePreview>
        <EditableInput class="clv-editable__input" :aria-label="label">
          <slot name="input" v-bind="state" />
        </EditableInput>
      </EditableArea>
      <div class="clv-editable__actions">
        <slot name="actions" v-bind="state">
          <EditableEditTrigger v-if="!state.isEditing && !readonly" class="clv-editable__button"
            >Edit</EditableEditTrigger
          >
          <template v-else-if="state.isEditing">
            <EditableSubmitTrigger
              class="clv-editable__button clv-editable__button--primary"
              aria-label="Save changes"
              >Save</EditableSubmitTrigger
            >
            <EditableCancelTrigger class="clv-editable__button" aria-label="Cancel changes">
              Cancel
            </EditableCancelTrigger>
          </template>
        </slot>
      </div>
    </EditableRoot>
    <span v-if="help || error" :id="descriptionId" :class="{ 'clv-editable-field__error': error }">
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

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
</style>
