<script setup lang="ts">
import { computed, useId } from 'vue'
import { RatingItem, RatingItemIndicator, RatingRoot } from 'reka-ui'
import { useClvComponent } from '../../headless'
import type { RatingPartContext, RatingParts } from '../../parts'

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
    unstyled?: boolean
    parts?: RatingParts
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
const { classes, part, slotContext } = useClvComponent<RatingPartContext>('rating', props)

const generatedId = useId()
const ratingId = computed(() => props.id ?? generatedId)
const labelId = computed(() => `${ratingId.value}-label`)
const descriptionId = computed(() =>
  props.help || props.error ? `${ratingId.value}-description` : undefined,
)
</script>

<template>
  <div
    :class="classes('clv-rating-field')"
    v-bind="part('root', { disabled, readonly, invalid: Boolean(error) })"
  >
    <span
      v-if="label"
      :id="labelId"
      :class="classes('clv-rating-field__label')"
      v-bind="part('label', { disabled, readonly, invalid: Boolean(error) })"
      >{{ label }}</span
    >
    <RatingRoot
      v-slot="{ items }"
      :id="ratingId"
      v-model="model"
      :class="classes('clv-rating')"
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
      v-bind="part('group', { disabled, readonly, invalid: Boolean(error) })"
    >
      <RatingItem
        v-for="(item, index) in items"
        :key="item"
        v-slot="{ steps }"
        :class="classes('clv-rating__item')"
        :item="item"
        v-bind="part('item', { index, value: item, disabled, readonly })"
      >
        <span
          :class="classes('clv-rating__empty')"
          aria-hidden="true"
          v-bind="part('empty', { index, value: item, disabled, readonly })"
          >☆</span
        >
        <RatingItemIndicator
          v-for="ratingStep in steps"
          :key="ratingStep"
          :class="classes('clv-rating__indicator')"
          :step="ratingStep"
          :aria-label="`${ratingStep} stars`"
          v-bind="part('indicator', { index, value: ratingStep, disabled, readonly })"
        >
          <slot
            name="item"
            :value="ratingStep"
            :selected="model >= ratingStep"
            :context="slotContext('indicator', { index, value: ratingStep, disabled, readonly })"
            >★</slot
          >
        </RatingItemIndicator>
      </RatingItem>
    </RatingRoot>
    <slot
      name="preview"
      :value="model"
      :length="length"
      :context="slotContext('value', { value: model, disabled, readonly })"
    >
      <span
        :class="classes('clv-rating-field__value')"
        v-bind="part('value', { value: model, disabled, readonly })"
        >{{ model }} / {{ length }}</span
      >
    </slot>
    <span
      v-if="help || error"
      :id="descriptionId"
      :class="classes({ 'clv-rating-field__error': error })"
      v-bind="part('description', { value: model, disabled, readonly, invalid: Boolean(error) })"
    >
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
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
}
</style>
