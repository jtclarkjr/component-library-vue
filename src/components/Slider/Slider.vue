<script setup lang="ts">
import { computed } from 'vue'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'

const model = defineModel<number | number[]>({ default: 0 })
const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    orientation?: 'horizontal' | 'vertical'
    disabled?: boolean
    inverted?: boolean
    minStepsBetweenThumbs?: number
    labels?: string[]
  }>(),
  { min: 0, max: 100, step: 1, orientation: 'horizontal', disabled: false, inverted: false },
)

const emit = defineEmits<{
  commit: [value: number | number[]]
}>()

const values = computed<number[]>({
  get: () => (Array.isArray(model.value) ? model.value : [model.value]),
  set: (next) => {
    model.value = Array.isArray(model.value) ? next : (next[0] ?? props.min)
  },
})

function normalize(next: number[]) {
  return Array.isArray(model.value) ? next : (next[0] ?? props.min)
}
</script>

<template>
  <SliderRoot
    v-model="values"
    class="clv-slider"
    :class="`clv-slider--${orientation}`"
    :min="min"
    :max="max"
    :step="step"
    :orientation="orientation"
    :disabled="disabled"
    :inverted="inverted"
    :min-steps-between-thumbs="minStepsBetweenThumbs"
    @value-commit="emit('commit', normalize($event))"
  >
    <SliderTrack class="clv-slider__track">
      <SliderRange class="clv-slider__range" />
    </SliderTrack>
    <SliderThumb
      v-for="(_, index) in values"
      :key="index"
      class="clv-slider__thumb"
      :aria-label="labels?.[index] ?? (values.length > 1 ? `Value ${index + 1}` : 'Value')"
    />
  </SliderRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-slider {
  position: relative;
  display: flex;
  align-items: center;
  touch-action: none;
  user-select: none;

  &--horizontal {
    width: 100%;
    height: 1.5rem;
  }

  &--vertical {
    width: 1.5rem;
    height: 12rem;
    flex-direction: column;
  }

  &[data-disabled] {
    @include disabled;
  }

  &__track {
    position: relative;
    overflow: hidden;
    flex: 1;
    border-radius: 999px;
    background: var(--clv-color-surface-raised);
  }

  &--horizontal &__track {
    width: 100%;
    height: 0.4rem;
  }

  &--vertical &__track {
    width: 0.4rem;
    height: 100%;
  }

  &__range {
    position: absolute;
    border-radius: inherit;
    background: var(--clv-color-primary);
  }

  &--horizontal &__range {
    height: 100%;
  }

  &--vertical &__range {
    width: 100%;
  }

  &__thumb {
    display: block;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid var(--clv-color-primary);
    border-radius: 50%;
    background: var(--clv-color-text);
    box-shadow: var(--clv-shadow-sm);
    cursor: grab;

    &:focus-visible {
      @include focus-ring;
    }
  }
}
</style>
