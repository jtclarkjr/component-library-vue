<script setup lang="ts">
import { computed, useId } from 'vue'
import {
  DateFieldInput,
  DateFieldRoot,
  DateRangeFieldInput,
  DateRangeFieldRoot,
  TimeFieldInput,
  TimeFieldRoot,
  TimeRangeFieldInput,
  TimeRangeFieldRoot,
} from 'reka-ui'

import type {
  ClvDateRange,
  ClvTimeRange,
  DateMatcher,
  DateStep,
  DateValue,
  TimeValue,
} from '../../types'

type FieldKind = 'date' | 'date-range' | 'time' | 'time-range'
type FieldValue = DateValue | TimeValue | ClvDateRange | ClvTimeRange | null | undefined

const props = withDefaults(
  defineProps<{
    kind: FieldKind
    modelValue?: FieldValue
    id?: string
    label?: string
    help?: string
    error?: string
    name?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    locale?: string
    hourCycle?: 12 | 24
    granularity?: 'day' | 'hour' | 'minute' | 'second'
    step?: DateStep
    stepSnapping?: boolean
    hideTimeZone?: boolean
    minValue?: DateValue | TimeValue
    maxValue?: DateValue | TimeValue
    placeholder?: DateValue | TimeValue
    unavailable?: DateMatcher | ((time: TimeValue) => boolean)
  }>(),
  {
    required: false,
    disabled: false,
    readonly: false,
    locale: 'en-US',
    hourCycle: 24,
    stepSnapping: false,
    hideTimeZone: false,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: FieldValue] }>()

const suites = {
  date: { Root: DateFieldRoot, Input: DateFieldInput },
  'date-range': { Root: DateRangeFieldRoot, Input: DateRangeFieldInput },
  time: { Root: TimeFieldRoot, Input: TimeFieldInput },
  'time-range': { Root: TimeRangeFieldRoot, Input: TimeRangeFieldInput },
}

const suite = computed(() => suites[props.kind])
const isRange = computed(() => props.kind.endsWith('-range'))
const isTime = computed(() => props.kind.startsWith('time'))
const generatedId = useId()
const rootId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() =>
  props.help || props.error ? `${rootId.value}-description` : undefined,
)
const rootProps = computed(() => ({
  id: rootId.value,
  name: props.name,
  required: props.required,
  disabled: props.disabled,
  readonly: props.readonly,
  locale: props.locale,
  hourCycle: props.hourCycle,
  granularity: props.granularity,
  step: props.step,
  stepSnapping: props.stepSnapping,
  hideTimeZone: props.hideTimeZone,
  minValue: props.minValue,
  maxValue: props.maxValue,
  placeholder: props.placeholder,
  ...(isTime.value
    ? { isTimeUnavailable: props.unavailable }
    : { isDateUnavailable: props.unavailable }),
}))
</script>

<template>
  <div class="clv-date-field" :data-kind="kind" :data-invalid="error ? '' : undefined">
    <span v-if="label" :id="`${rootId}-label`" class="clv-date-field__label">{{ label }}</span>
    <component
      :is="suite.Root"
      v-bind="rootProps"
      class="clv-date-field__segments"
      :model-value="modelValue"
      :aria-label="label"
      :aria-labelledby="label ? `${rootId}-label` : undefined"
      :aria-describedby="descriptionId"
      :aria-invalid="error ? 'true' : undefined"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <template #default="state">
        <template v-if="isRange">
          <div class="clv-date-field__range">
            <component
              :is="suite.Input"
              v-for="segment in state.segments.start"
              :key="`start-${segment.part}`"
              class="clv-date-field__segment"
              :part="segment.part"
              type="start"
            >
              <slot name="segment" v-bind="segment" range-part="start">
                {{ segment.value }}
              </slot>
            </component>
          </div>
          <span class="clv-date-field__separator" aria-hidden="true">–</span>
          <div class="clv-date-field__range">
            <component
              :is="suite.Input"
              v-for="segment in state.segments.end"
              :key="`end-${segment.part}`"
              class="clv-date-field__segment"
              :part="segment.part"
              type="end"
            >
              <slot name="segment" v-bind="segment" range-part="end">
                {{ segment.value }}
              </slot>
            </component>
          </div>
        </template>
        <template v-else>
          <component
            :is="suite.Input"
            v-for="segment in state.segments"
            :key="segment.part"
            class="clv-date-field__segment"
            :part="segment.part"
          >
            <slot name="segment" v-bind="segment">{{ segment.value }}</slot>
          </component>
        </template>
      </template>
    </component>
    <span v-if="help || error" :id="descriptionId" :class="{ 'clv-date-field__error': error }">
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-date-field {
  @include field-stack;

  &__label {
    @include field-label;
  }

  &__segments {
    @include segmented-field;
    display: flex;
    align-items: center;
    gap: 0.125rem;
    min-height: var(--clv-control-height);
    padding: 0.375rem 0.625rem;
  }

  &__segments:focus-within {
    @include focus-ring;
  }

  &__range {
    display: flex;
    gap: 0.125rem;
  }

  &__separator {
    color: var(--clv-color-text-muted);
  }

  &__segment {
    border-radius: var(--clv-radius-sm);
    padding: 0.125rem;
    outline: 0;
    color: var(--clv-color-text);
    font-variant-numeric: tabular-nums;
  }

  &__segment[data-placeholder] {
    color: var(--clv-color-text-muted);
  }

  &__segment:focus {
    background: var(--clv-color-selection);
  }

  &__segments[data-disabled] {
    @include disabled;
  }

  &__error {
    color: var(--clv-color-danger);
  }
}
</style>
