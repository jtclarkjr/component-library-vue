<script setup lang="ts">
import { computed, useId } from 'vue'
import { PinInputInput, PinInputRoot } from 'reka-ui'

const model = defineModel<string[] | number[]>({ default: () => [] })
const props = withDefaults(
  defineProps<{
    id?: string
    length?: number
    label?: string
    help?: string
    error?: string
    name?: string
    required?: boolean
    disabled?: boolean
    placeholder?: string
    mask?: boolean
    otp?: boolean
    type?: 'text' | 'number'
  }>(),
  {
    length: 6,
    required: false,
    disabled: false,
    placeholder: '○',
    mask: false,
    otp: false,
    type: 'text',
  },
)
const emit = defineEmits<{ complete: [value: string[] | number[]] }>()

const generatedId = useId()
const rootId = computed(() => props.id ?? generatedId)
const labelId = computed(() => `${rootId.value}-label`)
const descriptionId = computed(() =>
  props.help || props.error ? `${rootId.value}-description` : undefined,
)
</script>

<template>
  <div class="clv-pin-input-field">
    <span v-if="label" :id="labelId" class="clv-pin-input-field__label">{{ label }}</span>
    <PinInputRoot
      :id="rootId"
      v-model="model"
      class="clv-pin-input"
      :name="name"
      :required="required"
      :disabled="disabled"
      :placeholder="placeholder"
      :mask="mask"
      :otp="otp"
      :type="type"
      :aria-labelledby="label ? labelId : undefined"
      :aria-describedby="descriptionId"
      :aria-invalid="error ? 'true' : undefined"
      @complete="emit('complete', $event)"
    >
      <slot
        v-for="index in length"
        name="digit"
        :key="index"
        :index="index - 1"
        :value="model[index - 1]"
      >
        <PinInputInput class="clv-pin-input__digit" :index="index - 1" />
      </slot>
    </PinInputRoot>
    <span v-if="help || error" :id="descriptionId" :class="{ 'clv-pin-input-field__error': error }">
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-pin-input-field {
  @include field-stack;
  &__label {
    @include field-label;
  }
  &__error {
    color: var(--clv-color-danger);
  }
}
.clv-pin-input {
  display: flex;
  flex-wrap: wrap;
  gap: var(--clv-space-2);
  &__digit {
    @include field;
    width: 2.75rem;
    padding: 0.55rem;
    text-align: center;
    font-size: 1.15rem;
    font-weight: 800;
    &:focus-visible {
      @include focus-ring;
      border-color: var(--clv-color-primary);
    }
    &:disabled {
      @include disabled;
    }
  }
}
</style>
