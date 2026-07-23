<script setup lang="ts">
import { computed, useId } from 'vue'
import {
  DatePickerCalendar,
  DatePickerCell,
  DatePickerCellTrigger,
  DatePickerContent,
  DatePickerField,
  DatePickerGrid,
  DatePickerGridBody,
  DatePickerGridHead,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerHeader,
  DatePickerHeading,
  DatePickerInput,
  DatePickerNext,
  DatePickerPrev,
  DatePickerRoot,
  DatePickerTrigger,
  DateRangePickerCalendar,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
  DateRangePickerContent,
  DateRangePickerField,
  DateRangePickerGrid,
  DateRangePickerGridBody,
  DateRangePickerGridHead,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerHeader,
  DateRangePickerHeading,
  DateRangePickerInput,
  DateRangePickerNext,
  DateRangePickerPrev,
  DateRangePickerRoot,
  DateRangePickerTrigger,
} from 'reka-ui'

import type { ClvDateRange, DateMatcher, DateStep, DateValue } from '../../types'

type PickerValue = DateValue | ClvDateRange | null | undefined

const props = withDefaults(
  defineProps<{
    range?: boolean
    modelValue?: PickerValue
    open?: boolean
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
    minValue?: DateValue
    maxValue?: DateValue
    placeholder?: DateValue
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    weekdayFormat?: 'narrow' | 'short' | 'long'
    fixedWeeks?: boolean
    numberOfMonths?: number
    pagedNavigation?: boolean
    disableDaysOutsideCurrentView?: boolean
    isDateDisabled?: DateMatcher
    isDateUnavailable?: DateMatcher
    allowNonContiguousRanges?: boolean
    maximumDays?: number
    fixedDate?: 'start' | 'end'
    closeOnSelect?: boolean
    modal?: boolean
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
  }>(),
  {
    range: false,
    open: false,
    label: 'Choose date',
    required: false,
    disabled: false,
    readonly: false,
    locale: 'en-US',
    hourCycle: 24,
    granularity: 'day',
    stepSnapping: false,
    hideTimeZone: false,
    weekStartsOn: 0,
    weekdayFormat: 'short',
    fixedWeeks: false,
    numberOfMonths: 1,
    pagedNavigation: false,
    disableDaysOutsideCurrentView: false,
    allowNonContiguousRanges: false,
    closeOnSelect: true,
    modal: false,
    side: 'bottom',
    align: 'start',
    sideOffset: 6,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: PickerValue]
  'update:open': [value: boolean]
}>()

const singleSuite = {
  Root: DatePickerRoot,
  Field: DatePickerField,
  Input: DatePickerInput,
  Trigger: DatePickerTrigger,
  Content: DatePickerContent,
  Calendar: DatePickerCalendar,
  Header: DatePickerHeader,
  Heading: DatePickerHeading,
  Prev: DatePickerPrev,
  Next: DatePickerNext,
  Grid: DatePickerGrid,
  GridHead: DatePickerGridHead,
  GridBody: DatePickerGridBody,
  GridRow: DatePickerGridRow,
  HeadCell: DatePickerHeadCell,
  Cell: DatePickerCell,
  CellTrigger: DatePickerCellTrigger,
}
const rangeSuite = {
  Root: DateRangePickerRoot,
  Field: DateRangePickerField,
  Input: DateRangePickerInput,
  Trigger: DateRangePickerTrigger,
  Content: DateRangePickerContent,
  Calendar: DateRangePickerCalendar,
  Header: DateRangePickerHeader,
  Heading: DateRangePickerHeading,
  Prev: DateRangePickerPrev,
  Next: DateRangePickerNext,
  Grid: DateRangePickerGrid,
  GridHead: DateRangePickerGridHead,
  GridBody: DateRangePickerGridBody,
  GridRow: DateRangePickerGridRow,
  HeadCell: DateRangePickerHeadCell,
  Cell: DateRangePickerCell,
  CellTrigger: DateRangePickerCellTrigger,
}
const suite = computed(() => (props.range ? rangeSuite : singleSuite))
const generatedId = useId()
const rootId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() =>
  props.help || props.error ? `${rootId.value}-description` : undefined,
)
const displayValue = computed(() => {
  if (!props.modelValue) return 'Select'
  if ('start' in props.modelValue) {
    const start = props.modelValue.start?.toString() ?? 'Start'
    const end = props.modelValue.end?.toString() ?? 'End'
    return `${start} – ${end}`
  }
  return props.modelValue.toString()
})
const rootProps = computed(() => ({
  calendarLabel: props.label,
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
  weekStartsOn: props.weekStartsOn,
  weekdayFormat: props.weekdayFormat,
  fixedWeeks: props.fixedWeeks,
  numberOfMonths: props.numberOfMonths,
  pagedNavigation: props.pagedNavigation,
  disableDaysOutsideCurrentView: props.disableDaysOutsideCurrentView,
  isDateDisabled: props.isDateDisabled,
  isDateUnavailable: props.isDateUnavailable,
  closeOnSelect: props.closeOnSelect,
  modal: props.modal,
  ...(props.range
    ? {
        allowNonContiguousRanges: props.allowNonContiguousRanges,
        maximumDays: props.maximumDays,
        fixedDate: props.fixedDate,
      }
    : {}),
}))

function close() {
  emit('update:open', false)
}
</script>

<template>
  <div class="clv-date-picker" :data-invalid="error ? '' : undefined">
    <span v-if="label" :id="`${rootId}-label`" class="clv-date-picker__label">{{ label }}</span>
    <component
      :is="suite.Root"
      v-bind="rootProps"
      :model-value="modelValue"
      :open="open"
      @update:model-value="emit('update:modelValue', $event)"
      @update:open="emit('update:open', $event)"
    >
      <div class="clv-date-picker__control">
        <component
          :is="suite.Field"
          v-slot="fieldState"
          class="clv-date-picker__segments"
          :aria-labelledby="label ? `${rootId}-label` : undefined"
          :aria-describedby="descriptionId"
          :aria-invalid="error ? 'true' : undefined"
        >
          <template v-if="range">
            <div class="clv-date-picker__range">
              <component
                :is="suite.Input"
                v-for="segment in fieldState.segments.start"
                :key="`start-${segment.part}`"
                class="clv-date-picker__segment"
                :part="segment.part"
                type="start"
              >
                <slot name="segment" v-bind="segment" range-part="start">
                  {{ segment.value }}
                </slot>
              </component>
            </div>
            <span class="clv-date-picker__separator" aria-hidden="true">–</span>
            <div class="clv-date-picker__range">
              <component
                :is="suite.Input"
                v-for="segment in fieldState.segments.end"
                :key="`end-${segment.part}`"
                class="clv-date-picker__segment"
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
              v-for="segment in fieldState.segments"
              :key="segment.part"
              class="clv-date-picker__segment"
              :part="segment.part"
            >
              <slot name="segment" v-bind="segment">{{ segment.value }}</slot>
            </component>
          </template>
        </component>
        <component :is="suite.Trigger" class="clv-date-picker__trigger" aria-label="Open calendar">
          <slot name="trigger" :open="open" :value="modelValue">
            <slot name="value" :value="modelValue" :formatted-value="displayValue">▣</slot>
          </slot>
        </component>
      </div>

      <Teleport to="body">
        <component
          :is="suite.Content"
          class="clv-date-picker__content"
          :side="side"
          :align="align"
          :side-offset="sideOffset"
        >
          <slot name="content" :close="close" :value="modelValue">
            <component
              :is="suite.Calendar"
              v-slot="calendarState"
              class="clv-date-picker__calendar"
            >
              <component :is="suite.Header" class="clv-date-picker__header">
                <component :is="suite.Prev" class="clv-date-picker__nav" aria-label="Previous page">
                  <slot name="navigation-control" direction="previous" :state="calendarState"
                    >‹</slot
                  >
                </component>
                <component
                  :is="suite.Heading"
                  v-slot="headingState"
                  class="clv-date-picker__heading"
                >
                  <slot name="heading" v-bind="headingState" :state="calendarState">
                    {{ headingState.headingValue }}
                  </slot>
                </component>
                <component :is="suite.Next" class="clv-date-picker__nav" aria-label="Next page">
                  <slot name="navigation-control" direction="next" :state="calendarState">›</slot>
                </component>
              </component>
              <div class="clv-date-picker__months">
                <component
                  :is="suite.Grid"
                  v-for="month in calendarState.grid"
                  :key="month.value.toString()"
                  class="clv-date-picker__grid"
                >
                  <component :is="suite.GridHead">
                    <component :is="suite.GridRow" class="clv-date-picker__week">
                      <component
                        :is="suite.HeadCell"
                        v-for="weekDay in calendarState.weekDays"
                        :key="weekDay"
                        class="clv-date-picker__weekday"
                      >
                        {{ weekDay }}
                      </component>
                    </component>
                  </component>
                  <component :is="suite.GridBody">
                    <component
                      :is="suite.GridRow"
                      v-for="(week, weekIndex) in month.rows"
                      :key="weekIndex"
                      class="clv-date-picker__week"
                    >
                      <component
                        :is="suite.Cell"
                        v-for="day in week"
                        :key="day.toString()"
                        :date="day"
                        class="clv-date-picker__cell"
                      >
                        <component
                          :is="suite.CellTrigger"
                          v-slot="cellState"
                          class="clv-date-picker__day"
                          :day="day"
                          :month="month.value"
                        >
                          <slot name="cell" :day="day" :month="month.value" v-bind="cellState">
                            {{ cellState.dayValue }}
                          </slot>
                        </component>
                      </component>
                    </component>
                  </component>
                </component>
              </div>
            </component>
          </slot>
          <slot name="footer" :close="close" :value="modelValue" />
        </component>
      </Teleport>
    </component>
    <span v-if="help || error" :id="descriptionId" :class="{ 'clv-date-picker__error': error }">
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-date-picker {
  @include field-stack;

  &__label {
    @include field-label;
  }

  &__control {
    @include segmented-field;
    display: grid;
    grid-template-columns: 1fr auto;
    min-height: var(--clv-control-height);
    overflow: hidden;
  }

  &__control:focus-within {
    @include focus-ring;
  }

  &__segments,
  &__range {
    display: flex;
    align-items: center;
    gap: 0.125rem;
  }

  &__segments {
    padding: 0.375rem 0.625rem;
  }

  &__segment {
    border-radius: var(--clv-radius-sm);
    padding: 0.125rem;
    outline: 0;
    font-variant-numeric: tabular-nums;
  }

  &__segment[data-placeholder] {
    color: var(--clv-color-text-muted);
  }

  &__segment:focus {
    background: var(--clv-color-selection);
  }

  &__separator {
    color: var(--clv-color-text-muted);
  }

  &__trigger {
    width: 2.75rem;
    border: 0;
    border-left: 1px solid var(--clv-color-border);
    background: var(--clv-color-surface);
    color: var(--clv-color-text);
    cursor: pointer;
  }

  &__trigger:focus-visible {
    @include focus-ring;
    outline-offset: -3px;
  }

  &__error {
    color: var(--clv-color-danger);
  }
}

.clv-date-picker__content {
  @include floating-surface;
  z-index: var(--clv-z-popover);
  padding: 0.75rem;
  color: var(--clv-color-text);
  transform-origin: var(--reka-date-picker-content-transform-origin);
  animation: clv-picker-in var(--clv-motion-duration-fast) var(--clv-motion-easing);
}

.clv-date-picker__header {
  display: grid;
  grid-template-columns: 2rem 1fr 2rem;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.clv-date-picker__heading {
  text-align: center;
  font-weight: 650;
}

.clv-date-picker__nav,
.clv-date-picker__day {
  border: 0;
  border-radius: var(--clv-radius-md);
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.clv-date-picker__nav {
  height: 2rem;
  border: 1px solid var(--clv-color-border);
  background: var(--clv-color-surface);
}

.clv-date-picker__months {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.clv-date-picker__grid {
  border-collapse: collapse;
}

.clv-date-picker__week {
  display: grid;
  grid-template-columns: repeat(7, 2.25rem);
}

.clv-date-picker__weekday {
  padding-block: 0.25rem;
  color: var(--clv-color-text-muted);
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.clv-date-picker__cell {
  display: grid;
  place-items: center;
}

.clv-date-picker__day {
  display: grid;
  width: 2.125rem;
  height: 2.125rem;
  place-items: center;
}

.clv-date-picker__day:hover:not(:disabled) {
  background: var(--clv-color-surface);
}

.clv-date-picker__nav:focus-visible,
.clv-date-picker__day:focus-visible {
  @include focus-ring;
}

.clv-date-picker__day[data-outside-view] {
  color: var(--clv-color-text-muted);
}

.clv-date-picker__day[data-highlighted],
.clv-date-picker__day[data-selected] {
  background: var(--clv-color-primary);
  color: var(--clv-color-on-primary);
}

@keyframes clv-picker-in {
  from {
    opacity: 0;
    transform: translateY(-0.25rem) scale(0.98);
  }
}

@media (prefers-reduced-motion: reduce) {
  .clv-date-picker__content {
    animation: none;
  }
}
</style>
