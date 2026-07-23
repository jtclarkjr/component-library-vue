<script setup lang="ts">
import { computed, useId } from 'vue'
import { RatingItem, RatingItemIndicator, RatingRoot } from 'reka-ui'

const model = defineModel<number>({ default: 0 })
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
    readonly?: boolean
    clearable?: boolean
    hoverable?: boolean
    step?: 1 | 0.5 | 0.25 | 0.1
  }>(),
  {
    length: 5,
    required: false,
    disabled: false,
    readonly: false,
    clearable: false,
    hoverable: true,
    step: 1,
  },
)

const generatedId = useId()
const ratingId = computed(() => props.id ?? generatedId)
const labelId = computed(() => `${ratingId.value}-label`)
const descriptionId = computed(() =>
  props.help || props.error ? `${ratingId.value}-description` : undefined,
)
</script>

<template>
  <div class="clv-rating-field">
    <span v-if="label" :id="labelId" class="clv-rating-field__label">{{ label }}</span>
    <RatingRoot
      v-slot="{ items }"
      :id="ratingId"
      v-model="model"
      class="clv-rating"
      :length="length"
      :name="name"
      :required="required"
      :disabled="disabled || readonly"
      :clearable="clearable"
      :hoverable="hoverable && !readonly"
      :step="step"
      :aria-labelledby="label ? labelId : undefined"
      :aria-describedby="descriptionId"
      :aria-invalid="error ? 'true' : undefined"
    >
      <RatingItem
        v-for="item in items"
        :key="item"
        v-slot="{ steps }"
        class="clv-rating__item"
        :item="item"
      >
        <span class="clv-rating__empty" aria-hidden="true">☆</span>
        <RatingItemIndicator
          v-for="ratingStep in steps"
          :key="ratingStep"
          class="clv-rating__indicator"
          :step="ratingStep"
          :aria-label="`${ratingStep} stars`"
        >
          <slot name="item" :value="ratingStep" :selected="model >= ratingStep">★</slot>
        </RatingItemIndicator>
      </RatingItem>
    </RatingRoot>
    <slot name="preview" :value="model" :length="length">
      <span class="clv-rating-field__value">{{ model }} / {{ length }}</span>
    </slot>
    <span v-if="help || error" :id="descriptionId" :class="{ 'clv-rating-field__error': error }">
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-rating-field {
  @include field-stack;
  &__label {
    @include field-label;
  }
  &__value {
    color: var(--clv-color-text-muted);
  }
  &__error {
    color: var(--clv-color-danger);
  }
}
.clv-rating {
  display: flex;
  width: fit-content;
  gap: var(--clv-space-1);
  &__item {
    position: relative;
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--clv-color-text-muted);
    cursor: pointer;
    font-size: 1.75rem;
    line-height: 1;
  }
  &__item:focus-visible {
    @include focus-ring;
    border-radius: var(--clv-radius-sm);
  }
  &__item[data-disabled] {
    @include disabled;
  }
  &__empty,
  &__indicator {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
  }
  &__indicator {
    overflow: hidden;
    color: var(--clv-color-warning);
  }
}
</style>
