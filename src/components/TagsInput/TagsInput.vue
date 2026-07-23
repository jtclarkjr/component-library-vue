<script setup lang="ts">
import { computed, useId } from 'vue'
import {
  TagsInputClear,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  TagsInputRoot,
} from 'reka-ui'

const model = defineModel<string[]>({ default: () => [] })
const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    help?: string
    error?: string
    placeholder?: string
    name?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    addOnPaste?: boolean
    addOnTab?: boolean
    addOnBlur?: boolean
    duplicate?: boolean
    delimiter?: string
    max?: number
  }>(),
  {
    placeholder: 'Add a tag…',
    required: false,
    disabled: false,
    readonly: false,
    addOnPaste: true,
    addOnTab: true,
    addOnBlur: true,
    duplicate: false,
    delimiter: ',',
    max: 0,
  },
)
const emit = defineEmits<{
  invalid: [value: string]
  add: [value: string]
  remove: [value: string]
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() =>
  props.help || props.error ? `${inputId.value}-description` : undefined,
)
</script>

<template>
  <div class="clv-tags-input-field">
    <label v-if="label" class="clv-tags-input-field__label" :for="inputId">{{ label }}</label>
    <TagsInputRoot
      v-model="model"
      class="clv-tags-input"
      :id="inputId"
      :name="name"
      :required="required"
      :disabled="disabled || readonly"
      :add-on-paste="addOnPaste"
      :add-on-tab="addOnTab"
      :add-on-blur="addOnBlur"
      :duplicate="duplicate"
      :delimiter="delimiter"
      :max="max"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="descriptionId"
      @invalid="emit('invalid', $event)"
      @add-tag="emit('add', $event)"
      @remove-tag="emit('remove', $event)"
    >
      <TagsInputItem v-for="tag in model" :key="tag" class="clv-tags-input__tag" :value="tag">
        <slot name="item" :tag="tag">
          <TagsInputItemText />
        </slot>
        <TagsInputItemDelete class="clv-tags-input__delete" :aria-label="`Remove ${tag}`"
          >×</TagsInputItemDelete
        >
      </TagsInputItem>
      <slot name="input" :values="model">
        <TagsInputInput
          class="clv-tags-input__input"
          :placeholder="placeholder"
          :aria-label="label"
        />
      </slot>
      <TagsInputClear v-if="model.length" class="clv-tags-input__clear" aria-label="Clear all tags"
        >Clear</TagsInputClear
      >
    </TagsInputRoot>
    <span
      v-if="help || error"
      :id="descriptionId"
      :class="{ 'clv-tags-input-field__error': error }"
    >
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-tags-input-field {
  @include field-stack;
  &__label {
    @include field-label;
  }
  &__error {
    color: var(--clv-color-danger);
  }
}
.clv-tags-input {
  @include field;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--clv-space-2);
  padding: var(--clv-space-2);
  &:focus-within {
    @include focus-ring;
  }
  &[data-disabled] {
    @include disabled;
  }
  &__tag {
    display: inline-flex;
    align-items: center;
    gap: var(--clv-space-1);
    padding: 0.3rem 0.45rem;
    border-radius: var(--clv-radius-sm);
    background: var(--clv-color-surface-raised);
    color: var(--clv-color-text);
  }
  &__delete,
  &__clear {
    border: 0;
    background: transparent;
    color: var(--clv-color-text-muted);
    cursor: pointer;
  }
  &__input {
    min-width: 7rem;
    flex: 1;
    padding: 0.35rem;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--clv-color-text);
    font: inherit;
  }
  &__clear {
    margin-left: auto;
  }
}
</style>
