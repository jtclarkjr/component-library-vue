<script setup lang="ts">
import { computed } from 'vue'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot,
} from 'reka-ui'

import type { ClvDateRange, DateMatcher, DateValue } from '../../types'

type CalendarValue = DateValue | DateValue[] | ClvDateRange | null | undefined

const props = withDefaults(
  defineProps<{
    range?: boolean
    modelValue?: CalendarValue
    label?: string
    locale?: string
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    weekdayFormat?: 'narrow' | 'short' | 'long'
    minValue?: DateValue
    maxValue?: DateValue
    disabled?: boolean
    readonly?: boolean
    initialFocus?: boolean
    multiple?: boolean
    fixedWeeks?: boolean
    numberOfMonths?: number
    pagedNavigation?: boolean
    preventDeselect?: boolean
    disableDaysOutsideCurrentView?: boolean
    isDateDisabled?: DateMatcher
    isDateUnavailable?: DateMatcher
    allowNonContiguousRanges?: boolean
    maximumDays?: number
    fixedDate?: 'start' | 'end'
  }>(),
  {
    range: false,
    label: 'Calendar',
    locale: 'en-US',
    weekStartsOn: 0,
    weekdayFormat: 'short',
    disabled: false,
    readonly: false,
    initialFocus: false,
    multiple: false,
    fixedWeeks: false,
    numberOfMonths: 1,
    pagedNavigation: false,
    preventDeselect: false,
    disableDaysOutsideCurrentView: false,
    allowNonContiguousRanges: false,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: CalendarValue] }>()

const singleSuite = {
  Root: CalendarRoot,
  Header: CalendarHeader,
  Heading: CalendarHeading,
  Prev: CalendarPrev,
  Next: CalendarNext,
  Grid: CalendarGrid,
  GridHead: CalendarGridHead,
  GridBody: CalendarGridBody,
  GridRow: CalendarGridRow,
  HeadCell: CalendarHeadCell,
  Cell: CalendarCell,
  CellTrigger: CalendarCellTrigger,
}
const rangeSuite = {
  Root: RangeCalendarRoot,
  Header: RangeCalendarHeader,
  Heading: RangeCalendarHeading,
  Prev: RangeCalendarPrev,
  Next: RangeCalendarNext,
  Grid: RangeCalendarGrid,
  GridHead: RangeCalendarGridHead,
  GridBody: RangeCalendarGridBody,
  GridRow: RangeCalendarGridRow,
  HeadCell: RangeCalendarHeadCell,
  Cell: RangeCalendarCell,
  CellTrigger: RangeCalendarCellTrigger,
}
const suite = computed(() => (props.range ? rangeSuite : singleSuite))
const rootProps = computed(() => ({
  calendarLabel: props.label,
  locale: props.locale,
  weekStartsOn: props.weekStartsOn,
  weekdayFormat: props.weekdayFormat,
  minValue: props.minValue,
  maxValue: props.maxValue,
  disabled: props.disabled,
  readonly: props.readonly,
  initialFocus: props.initialFocus,
  fixedWeeks: props.fixedWeeks,
  numberOfMonths: props.numberOfMonths,
  pagedNavigation: props.pagedNavigation,
  preventDeselect: props.preventDeselect,
  disableDaysOutsideCurrentView: props.disableDaysOutsideCurrentView,
  isDateDisabled: props.isDateDisabled,
  isDateUnavailable: props.isDateUnavailable,
  ...(props.range
    ? {
        allowNonContiguousRanges: props.allowNonContiguousRanges,
        maximumDays: props.maximumDays,
        fixedDate: props.fixedDate,
      }
    : { multiple: props.multiple }),
}))
</script>

<template>
  <component
    :is="suite.Root"
    v-bind="rootProps"
    class="clv-calendar"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #default="calendarState">
      <component :is="suite.Header" class="clv-calendar__header">
        <component :is="suite.Prev" class="clv-calendar__nav" aria-label="Previous page">
          <slot name="navigation-control" direction="previous" :state="calendarState">‹</slot>
        </component>
        <component :is="suite.Heading" v-slot="headingState" class="clv-calendar__heading">
          <slot name="heading" v-bind="headingState" :state="calendarState">
            {{ headingState.headingValue }}
          </slot>
        </component>
        <component :is="suite.Next" class="clv-calendar__nav" aria-label="Next page">
          <slot name="navigation-control" direction="next" :state="calendarState">›</slot>
        </component>
      </component>

      <div class="clv-calendar__months">
        <component
          :is="suite.Grid"
          v-for="month in calendarState.grid"
          :key="month.value.toString()"
          class="clv-calendar__grid"
        >
          <component :is="suite.GridHead">
            <component :is="suite.GridRow" class="clv-calendar__week">
              <component
                :is="suite.HeadCell"
                v-for="weekDay in calendarState.weekDays"
                :key="weekDay"
                class="clv-calendar__weekday"
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
              class="clv-calendar__week"
            >
              <component
                :is="suite.Cell"
                v-for="day in week"
                :key="day.toString()"
                :date="day"
                class="clv-calendar__cell"
              >
                <component
                  :is="suite.CellTrigger"
                  v-slot="cellState"
                  class="clv-calendar__day"
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
    </template>
  </component>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-calendar {
  width: max-content;
  border: 1px solid var(--clv-color-border);
  border-radius: var(--clv-radius-lg);
  background: var(--clv-color-surface-raised);
  padding: 0.75rem;
  color: var(--clv-color-text);

  &__header {
    display: grid;
    grid-template-columns: 2rem 1fr 2rem;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  &__heading {
    text-align: center;
    font-weight: 650;
  }

  &__nav {
    height: 2rem;
    border: 1px solid var(--clv-color-border);
    border-radius: var(--clv-radius-md);
    background: var(--clv-color-surface);
    color: inherit;
    cursor: pointer;
  }

  &__nav:focus-visible,
  &__day:focus-visible {
    @include focus-ring;
  }

  &__nav:disabled,
  &__day:disabled {
    @include disabled;
  }

  &__months {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  &__grid {
    border-collapse: collapse;
  }

  &__week {
    display: grid;
    grid-template-columns: repeat(7, 2.25rem);
  }

  &__weekday {
    padding-block: 0.25rem;
    color: var(--clv-color-text-muted);
    text-align: center;
    font-size: 0.75rem;
    font-weight: 600;
  }

  &__cell {
    display: grid;
    place-items: center;
  }

  &__day {
    display: grid;
    width: 2.125rem;
    height: 2.125rem;
    place-items: center;
    border: 0;
    border-radius: var(--clv-radius-md);
    background: transparent;
    color: inherit;
    cursor: pointer;
  }

  &__day:hover:not(:disabled) {
    background: var(--clv-color-surface);
  }

  &__day[data-outside-view] {
    color: var(--clv-color-text-muted);
  }

  &__day[data-unavailable] {
    text-decoration: line-through;
  }

  &__day[data-highlighted],
  &__day[data-selected] {
    background: var(--clv-color-primary);
    color: var(--clv-color-on-primary);
  }

  &__day[data-highlighted-start],
  &__day[data-highlighted-end] {
    background: var(--clv-color-primary-hover);
  }
}
</style>
