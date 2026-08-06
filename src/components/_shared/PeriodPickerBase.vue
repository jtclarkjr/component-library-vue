<script setup lang="ts">
import { computed } from 'vue'
import {
  MonthPickerCell,
  MonthPickerCellTrigger,
  MonthPickerGrid,
  MonthPickerGridBody,
  MonthPickerGridRow,
  MonthPickerHeader,
  MonthPickerHeading,
  MonthPickerNext,
  MonthPickerPrev,
  MonthPickerRoot,
  MonthRangePickerCell,
  MonthRangePickerCellTrigger,
  MonthRangePickerGrid,
  MonthRangePickerGridBody,
  MonthRangePickerGridRow,
  MonthRangePickerHeader,
  MonthRangePickerHeading,
  MonthRangePickerNext,
  MonthRangePickerPrev,
  MonthRangePickerRoot,
  YearPickerCell,
  YearPickerCellTrigger,
  YearPickerGrid,
  YearPickerGridBody,
  YearPickerGridRow,
  YearPickerHeader,
  YearPickerHeading,
  YearPickerNext,
  YearPickerPrev,
  YearPickerRoot,
  YearRangePickerCell,
  YearRangePickerCellTrigger,
  YearRangePickerGrid,
  YearRangePickerGridBody,
  YearRangePickerGridRow,
  YearRangePickerHeader,
  YearRangePickerHeading,
  YearRangePickerNext,
  YearRangePickerPrev,
  YearRangePickerRoot,
} from 'reka-ui'

import { useClvComponent } from '../../headless'
import type { MonthPickerPartContext, MonthPickerParts } from '../../parts'
import type { ClvDateRange, DateMatcher, DateValue } from '../../types'

type PeriodKind = 'month' | 'month-range' | 'year' | 'year-range'
type PeriodValue = DateValue | DateValue[] | ClvDateRange | null | undefined

const props = withDefaults(
  defineProps<{
    kind: PeriodKind
    modelValue?: PeriodValue
    label?: string
    locale?: string
    minValue?: DateValue
    maxValue?: DateValue
    disabled?: boolean
    readonly?: boolean
    multiple?: boolean
    preventDeselect?: boolean
    isPeriodDisabled?: DateMatcher
    isPeriodUnavailable?: DateMatcher
    allowNonContiguousRanges?: boolean
    maximumPeriods?: number
    fixedDate?: 'start' | 'end'
    yearsPerPage?: number
    unstyled?: boolean
    parts?: MonthPickerParts
  }>(),
  {
    label: 'Period picker',
    locale: 'en-US',
    disabled: false,
    readonly: false,
    multiple: false,
    preventDeselect: false,
    allowNonContiguousRanges: false,
    yearsPerPage: 12,
  },
)

const { classes, part, slotContext } = useClvComponent<MonthPickerPartContext>(props.kind, props)

const emit = defineEmits<{ 'update:modelValue': [value: PeriodValue] }>()

const suites = {
  month: {
    Root: MonthPickerRoot,
    Header: MonthPickerHeader,
    Heading: MonthPickerHeading,
    Prev: MonthPickerPrev,
    Next: MonthPickerNext,
    Grid: MonthPickerGrid,
    GridBody: MonthPickerGridBody,
    GridRow: MonthPickerGridRow,
    Cell: MonthPickerCell,
    CellTrigger: MonthPickerCellTrigger,
  },
  'month-range': {
    Root: MonthRangePickerRoot,
    Header: MonthRangePickerHeader,
    Heading: MonthRangePickerHeading,
    Prev: MonthRangePickerPrev,
    Next: MonthRangePickerNext,
    Grid: MonthRangePickerGrid,
    GridBody: MonthRangePickerGridBody,
    GridRow: MonthRangePickerGridRow,
    Cell: MonthRangePickerCell,
    CellTrigger: MonthRangePickerCellTrigger,
  },
  year: {
    Root: YearPickerRoot,
    Header: YearPickerHeader,
    Heading: YearPickerHeading,
    Prev: YearPickerPrev,
    Next: YearPickerNext,
    Grid: YearPickerGrid,
    GridBody: YearPickerGridBody,
    GridRow: YearPickerGridRow,
    Cell: YearPickerCell,
    CellTrigger: YearPickerCellTrigger,
  },
  'year-range': {
    Root: YearRangePickerRoot,
    Header: YearRangePickerHeader,
    Heading: YearRangePickerHeading,
    Prev: YearRangePickerPrev,
    Next: YearRangePickerNext,
    Grid: YearRangePickerGrid,
    GridBody: YearRangePickerGridBody,
    GridRow: YearRangePickerGridRow,
    Cell: YearRangePickerCell,
    CellTrigger: YearRangePickerCellTrigger,
  },
}

const suite = computed(() => suites[props.kind])
const isRange = computed(() => props.kind.endsWith('-range'))
const isYear = computed(() => props.kind.startsWith('year'))
const rootProps = computed(() => ({
  calendarLabel: props.label,
  locale: props.locale,
  minValue: props.minValue,
  maxValue: props.maxValue,
  disabled: props.disabled,
  readonly: props.readonly,
  preventDeselect: props.preventDeselect,
  ...(isYear.value
    ? {
        yearsPerPage: props.yearsPerPage,
        isYearDisabled: props.isPeriodDisabled,
        isYearUnavailable: props.isPeriodUnavailable,
      }
    : {
        isMonthDisabled: props.isPeriodDisabled,
        isMonthUnavailable: props.isPeriodUnavailable,
      }),
  ...(isRange.value
    ? {
        allowNonContiguousRanges: props.allowNonContiguousRanges,
        fixedDate: props.fixedDate,
        ...(isYear.value
          ? { maximumYears: props.maximumPeriods }
          : { maximumMonths: props.maximumPeriods }),
      }
    : { multiple: props.multiple }),
}))

function periodValue(state: { monthValue?: string; yearValue?: string }) {
  return state.yearValue ?? state.monthValue ?? ''
}
</script>

<template>
  <component
    :is="suite.Root"
    :class="classes('clv-period-picker')"
    v-bind="part('root', { disabled, readonly }, rootProps)"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #default="pickerState">
      <component
        :is="suite.Header"
        :class="classes('clv-period-picker__header')"
        v-bind="part('header', { disabled, readonly })"
      >
        <component
          :is="suite.Prev"
          :class="classes('clv-period-picker__nav')"
          aria-label="Previous page"
          v-bind="part('previous', { disabled, readonly })"
        >
          <slot
            name="navigation-control"
            direction="previous"
            :state="pickerState"
            :context="slotContext('previous', { disabled, readonly })"
            >‹</slot
          >
        </component>
        <component
          :is="suite.Heading"
          v-slot="headingState"
          :class="classes('clv-period-picker__heading')"
          v-bind="part('heading', { disabled, readonly })"
        >
          <slot
            name="heading"
            v-bind="headingState"
            :state="pickerState"
            :context="slotContext('heading', { disabled, readonly })"
          >
            {{ headingState.headingValue }}
          </slot>
        </component>
        <component
          :is="suite.Next"
          :class="classes('clv-period-picker__nav')"
          aria-label="Next page"
          v-bind="part('next', { disabled, readonly })"
        >
          <slot
            name="navigation-control"
            direction="next"
            :state="pickerState"
            :context="slotContext('next', { disabled, readonly })"
            >›</slot
          >
        </component>
      </component>
      <component
        :is="suite.Grid"
        :class="classes('clv-period-picker__grid')"
        v-bind="part('grid', { disabled, readonly })"
      >
        <component :is="suite.GridBody">
          <component
            :is="suite.GridRow"
            v-for="(row, rowIndex) in pickerState.grid.rows"
            :key="rowIndex"
            :class="classes('clv-period-picker__row')"
            v-bind="part('row', { index: rowIndex, rowIndex, disabled, readonly })"
          >
            <component
              :is="suite.Cell"
              v-for="(period, periodIndex) in row"
              :key="period.toString()"
              :class="classes('clv-period-picker__cell')"
              :date="period"
              v-bind="
                part('cell', { date: period, index: periodIndex, rowIndex, disabled, readonly })
              "
            >
              <component
                :is="suite.CellTrigger"
                v-slot="cellState"
                as-child
                v-bind="isYear ? { year: period } : { month: period }"
              >
                <div
                  :class="classes('clv-period-picker__option')"
                  v-bind="
                    part('option', {
                      date: period,
                      value: periodValue(cellState),
                      index: periodIndex,
                      rowIndex,
                      disabled,
                      readonly,
                      today: cellState.today,
                      unavailable: cellState.unavailable,
                      rangeStart: cellState.selectionStart,
                      rangeEnd: cellState.selectionEnd,
                      selected: cellState.selected,
                    })
                  "
                >
                  <slot
                    name="cell"
                    :date="period"
                    :value="periodValue(cellState)"
                    :context="
                      slotContext('option', {
                        date: period,
                        value: periodValue(cellState),
                        index: periodIndex,
                        rowIndex,
                        disabled,
                        readonly,
                        today: cellState.today,
                        unavailable: cellState.unavailable,
                        rangeStart: cellState.selectionStart,
                        rangeEnd: cellState.selectionEnd,
                        selected: cellState.selected,
                      })
                    "
                    v-bind="cellState"
                  >
                    {{ periodValue(cellState) }}
                  </slot>
                </div>
              </component>
            </component>
          </component>
        </component>
      </component>
    </template>
  </component>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-period-picker {
    width: min(20rem, 100%);
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
      margin-bottom: 0.625rem;
    }

    &__heading {
      text-align: center;
      font-weight: 650;
    }

    &__nav,
    &__option {
      border: 1px solid transparent;
      border-radius: var(--clv-radius-md);
      background: transparent;
      color: inherit;
      cursor: pointer;
    }

    &__nav {
      height: 2rem;
      border-color: var(--clv-color-border);
      background: var(--clv-color-surface);
    }

    &__nav:focus-visible,
    &__option:focus-visible {
      @include focus-ring;
    }

    &__nav:disabled,
    &__option:disabled {
      @include disabled;
    }

    &__grid {
      width: 100%;
    }

    &__row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.375rem;
    }

    &__option {
      width: 100%;
      min-height: 2.5rem;
      padding: 0.375rem;
    }

    &__option:hover:not(:disabled) {
      background: var(--clv-color-surface);
    }

    &__option[data-highlighted],
    &__option[data-selected] {
      background: var(--clv-color-primary);
      color: var(--clv-color-on-primary);
    }

    &__option[data-unavailable] {
      text-decoration: line-through;
    }
  }
}
</style>
