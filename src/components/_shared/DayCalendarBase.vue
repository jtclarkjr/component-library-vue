<script setup lang="ts">
import { computed, type Component } from 'vue'
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

import { useClvComponent } from '../../headless'
import type {
  CalendarParts,
  CalendarPartContext,
  DatePickerParts,
  DatePickerPartContext,
  DateRangePickerParts,
  DateRangePickerPartContext,
  RangeCalendarParts,
  RangeCalendarPartContext,
} from '../../parts'
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
    componentName?: 'calendar' | 'range-calendar' | 'date-picker' | 'date-range-picker'
    rootPart?: 'root' | 'calendar'
    unstyled?: boolean
    parts?: CalendarParts | RangeCalendarParts | DatePickerParts | DateRangePickerParts
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
    rootPart: 'root',
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
const rootComponent = computed<Component>(() => suite.value.Root)
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
const componentName = props.componentName ?? (props.range ? 'range-calendar' : 'calendar')
const { classes, part, slotContext } = useClvComponent<
  | CalendarPartContext
  | RangeCalendarPartContext
  | DatePickerPartContext
  | DateRangePickerPartContext
>(componentName, props)
</script>

<template>
  <component
    :is="rootComponent"
    :class="classes('clv-calendar')"
    @update:model-value="emit('update:modelValue', $event)"
    v-bind="{
      ...part(rootPart, {
        disabled,
        readonly,
        orientation: 'horizontal',
        value: modelValue,
        range,
      }),
      ...rootProps,
    }"
    :model-value="modelValue"
  >
    <template #default="calendarState">
      <component
        :is="suite.Header"
        :class="classes('clv-calendar__header')"
        v-bind="part('header', { disabled, readonly, value: modelValue, range })"
      >
        <component
          :is="suite.Prev"
          :class="classes('clv-calendar__nav')"
          aria-label="Previous page"
          v-bind="part('previous', { disabled, readonly, value: modelValue, range })"
        >
          <slot
            name="navigation-control"
            direction="previous"
            :state="calendarState"
            :context="slotContext('previous', { disabled, readonly, value: modelValue, range })"
            >‹</slot
          >
        </component>
        <component
          :is="suite.Heading"
          v-slot="headingState"
          :class="classes('clv-calendar__heading')"
          v-bind="part('heading', { disabled, readonly, value: modelValue, range })"
        >
          <slot
            name="heading"
            v-bind="headingState"
            :state="calendarState"
            :context="slotContext('heading', { disabled, readonly, value: modelValue, range })"
          >
            {{ headingState.headingValue }}
          </slot>
        </component>
        <component
          :is="suite.Next"
          :class="classes('clv-calendar__nav')"
          aria-label="Next page"
          v-bind="part('next', { disabled, readonly, value: modelValue, range })"
        >
          <slot
            name="navigation-control"
            direction="next"
            :state="calendarState"
            :context="slotContext('next', { disabled, readonly, value: modelValue, range })"
            >›</slot
          >
        </component>
      </component>

      <div
        :class="classes('clv-calendar__months')"
        v-bind="part('months', { disabled, readonly, value: modelValue, range })"
      >
        <component
          :is="suite.Grid"
          v-for="(month, monthIndex) in calendarState.grid"
          :key="month.value.toString()"
          :class="classes('clv-calendar__grid')"
          v-bind="
            part('grid', {
              month: month.value,
              index: monthIndex,
              disabled,
              readonly,
              value: modelValue,
              range,
            })
          "
        >
          <component
            :is="suite.GridHead"
            v-bind="
              part('weekdays', { month: month.value, index: monthIndex, disabled, readonly, range })
            "
          >
            <component
              :is="suite.GridRow"
              :class="classes('clv-calendar__week')"
              v-bind="part('week', { month: month.value, index: -1, disabled, readonly, range })"
            >
              <component
                :is="suite.HeadCell"
                v-for="(weekDay, weekdayIndex) in calendarState.weekDays"
                :key="weekDay"
                :class="classes('clv-calendar__weekday')"
                v-bind="
                  part('weekday', {
                    month: month.value,
                    index: weekdayIndex,
                    disabled,
                    readonly,
                    range,
                  })
                "
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
              :class="classes('clv-calendar__week')"
              v-bind="
                part('week', { month: month.value, index: weekIndex, disabled, readonly, range })
              "
            >
              <component
                :is="suite.Cell"
                v-for="(day, dayIndex) in week"
                :key="day.toString()"
                :date="day"
                :class="classes('clv-calendar__cell')"
                v-bind="
                  part('cell', {
                    date: day,
                    month: month.value,
                    index: dayIndex,
                    disabled,
                    readonly,
                    range,
                  })
                "
              >
                <component
                  :is="suite.CellTrigger"
                  v-slot="cellState"
                  as-child
                  :day="day"
                  :month="month.value"
                >
                  <div
                    :class="classes('clv-calendar__day')"
                    v-bind="
                      part('day', {
                        date: day,
                        month: month.value,
                        index: dayIndex,
                        disabled,
                        readonly,
                        range,
                        today: cellState.today,
                        outside: cellState.outsideView,
                        unavailable: cellState.unavailable,
                        rangeStart: cellState.highlightedStart,
                        rangeEnd: cellState.highlightedEnd,
                        selected: cellState.selected,
                      })
                    "
                  >
                    <slot
                      name="cell"
                      :day="day"
                      :month="month.value"
                      v-bind="cellState"
                      :context="
                        slotContext('day', {
                          date: day,
                          month: month.value,
                          index: dayIndex,
                          disabled,
                          readonly,
                          range,
                          today: cellState.today,
                          outside: cellState.outsideView,
                          unavailable: cellState.unavailable,
                          rangeStart: cellState.highlightedStart,
                          rangeEnd: cellState.highlightedEnd,
                          selected: cellState.selected,
                        })
                      "
                    >
                      {{ cellState.dayValue }}
                    </slot>
                  </div>
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

@layer clv.components {
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
}
</style>
