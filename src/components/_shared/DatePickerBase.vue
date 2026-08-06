<script setup lang="ts">
import { computed, useId, type Component } from 'vue'
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
  type SegmentPart,
} from 'reka-ui'

import { useClvComponent } from '../../headless'
import type {
  DatePickerPartContext,
  DatePickerParts,
  DateRangePickerPartContext,
  DateRangePickerParts,
} from '../../parts'
import type { ClvDateRange, DateMatcher, DateStep, DateValue } from '../../types'

type PickerValue = DateValue | ClvDateRange | null | undefined
type PickerSegment = { part: SegmentPart; value: string; isPlaceholder?: boolean }

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
    componentName?: 'date-picker' | 'date-range-picker'
    unstyled?: boolean
    parts?: DatePickerParts | DateRangePickerParts
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
const rootComponent = computed<Component>(() => suite.value.Root)
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
const componentName = props.componentName ?? (props.range ? 'date-range-picker' : 'date-picker')
const { classes, part, slotContext } = useClvComponent<
  DatePickerPartContext | DateRangePickerPartContext
>(componentName, props)

function rangeSegments(segments: unknown, rangePart: 'start' | 'end'): PickerSegment[] {
  return (segments as { start?: PickerSegment[]; end?: PickerSegment[] })[rangePart] ?? []
}

function singleSegments(segments: unknown): PickerSegment[] {
  return Array.isArray(segments) ? (segments as PickerSegment[]) : []
}

function close() {
  emit('update:open', false)
}
</script>

<template>
  <div
    :class="classes('clv-date-picker')"
    :data-invalid="error ? '' : undefined"
    v-bind="
      part('root', {
        open,
        disabled,
        readonly,
        required,
        invalid: Boolean(error),
        value: modelValue,
        range,
      })
    "
  >
    <span
      v-if="label"
      :id="`${rootId}-label`"
      :class="classes('clv-date-picker__label')"
      v-bind="
        part('label', {
          open,
          disabled,
          readonly,
          invalid: Boolean(error),
          value: modelValue,
          range,
        })
      "
      >{{ label }}</span
    >
    <component
      :is="rootComponent"
      v-bind="rootProps"
      :model-value="modelValue"
      :open="open"
      @update:model-value="emit('update:modelValue', $event)"
      @update:open="emit('update:open', $event)"
    >
      <div
        :class="classes('clv-date-picker__control')"
        v-bind="
          part('control', {
            open,
            disabled,
            readonly,
            required,
            invalid: Boolean(error),
            value: modelValue,
            range,
          })
        "
      >
        <component
          :is="suite.Field"
          v-slot="fieldState"
          :class="classes('clv-date-picker__segments')"
          :aria-labelledby="label ? `${rootId}-label` : undefined"
          :aria-describedby="descriptionId"
          :aria-invalid="error ? 'true' : undefined"
          v-bind="
            part('segments', {
              open,
              disabled,
              readonly,
              required,
              invalid: Boolean(error),
              value: modelValue,
              range,
            })
          "
        >
          <template v-if="range">
            <div
              :class="classes('clv-date-picker__range')"
              v-bind="
                part('startRange', {
                  open,
                  disabled,
                  readonly,
                  invalid: Boolean(error),
                  value: modelValue,
                  range,
                  rangePart: 'start',
                })
              "
            >
              <component
                :is="suite.Input"
                v-for="(segment, index) in rangeSegments(fieldState.segments, 'start')"
                :key="`start-${segment.part}`"
                :class="classes('clv-date-picker__segment')"
                :part="segment.part"
                type="start"
                v-bind="
                  part('segment', {
                    segment,
                    index,
                    rangePart: 'start',
                    placeholder: Boolean(segment.isPlaceholder),
                    open,
                    disabled,
                    readonly,
                    invalid: Boolean(error),
                    value: modelValue,
                    range,
                  })
                "
              >
                <slot
                  name="segment"
                  v-bind="segment"
                  range-part="start"
                  :context="
                    slotContext('segment', {
                      segment,
                      index,
                      rangePart: 'start',
                      placeholder: Boolean(segment.isPlaceholder),
                      open,
                      disabled,
                      readonly,
                      invalid: Boolean(error),
                      value: modelValue,
                      range,
                    })
                  "
                >
                  {{ segment.value }}
                </slot>
              </component>
            </div>
            <span
              :class="classes('clv-date-picker__separator')"
              aria-hidden="true"
              v-bind="part('separator', { open, disabled, readonly, value: modelValue, range })"
              >–</span
            >
            <div
              :class="classes('clv-date-picker__range')"
              v-bind="
                part('endRange', {
                  open,
                  disabled,
                  readonly,
                  invalid: Boolean(error),
                  value: modelValue,
                  range,
                  rangePart: 'end',
                })
              "
            >
              <component
                :is="suite.Input"
                v-for="(segment, index) in rangeSegments(fieldState.segments, 'end')"
                :key="`end-${segment.part}`"
                :class="classes('clv-date-picker__segment')"
                :part="segment.part"
                type="end"
                v-bind="
                  part('segment', {
                    segment,
                    index,
                    rangePart: 'end',
                    placeholder: Boolean(segment.isPlaceholder),
                    open,
                    disabled,
                    readonly,
                    invalid: Boolean(error),
                    value: modelValue,
                    range,
                  })
                "
              >
                <slot
                  name="segment"
                  v-bind="segment"
                  range-part="end"
                  :context="
                    slotContext('segment', {
                      segment,
                      index,
                      rangePart: 'end',
                      placeholder: Boolean(segment.isPlaceholder),
                      open,
                      disabled,
                      readonly,
                      invalid: Boolean(error),
                      value: modelValue,
                      range,
                    })
                  "
                >
                  {{ segment.value }}
                </slot>
              </component>
            </div>
          </template>
          <template v-else>
            <component
              :is="suite.Input"
              v-for="(segment, index) in singleSegments(fieldState.segments)"
              :key="segment.part"
              :class="classes('clv-date-picker__segment')"
              :part="segment.part"
              v-bind="
                part('segment', {
                  segment,
                  index,
                  placeholder: Boolean(segment.isPlaceholder),
                  open,
                  disabled,
                  readonly,
                  invalid: Boolean(error),
                  value: modelValue,
                  range,
                })
              "
            >
              <slot
                name="segment"
                v-bind="segment"
                :context="
                  slotContext('segment', {
                    segment,
                    index,
                    placeholder: Boolean(segment.isPlaceholder),
                    open,
                    disabled,
                    readonly,
                    invalid: Boolean(error),
                    value: modelValue,
                    range,
                  })
                "
                >{{ segment.value }}</slot
              >
            </component>
          </template>
        </component>
        <component
          :is="suite.Trigger"
          :class="classes('clv-date-picker__trigger')"
          aria-label="Open calendar"
          v-bind="part('trigger', { open, disabled, readonly, value: modelValue, range })"
        >
          <slot
            name="trigger"
            :open="open"
            :value="modelValue"
            :context="
              slotContext('trigger', { open, disabled, readonly, value: modelValue, range })
            "
          >
            <slot
              name="value"
              :value="modelValue"
              :formatted-value="displayValue"
              :context="
                slotContext('trigger', { open, disabled, readonly, value: modelValue, range })
              "
              >▣</slot
            >
          </slot>
        </component>
      </div>

      <Teleport to="body">
        <component
          :is="suite.Content"
          :class="classes('clv-date-picker__content')"
          :side="side"
          :align="align"
          :side-offset="sideOffset"
          v-bind="
            part(
              'content',
              { open, disabled, readonly, invalid: Boolean(error), value: modelValue, range },
              {},
              { surface: true },
            )
          "
        >
          <slot
            name="content"
            :close="close"
            :value="modelValue"
            :context="
              slotContext('content', {
                open,
                disabled,
                readonly,
                invalid: Boolean(error),
                value: modelValue,
                range,
              })
            "
          >
            <component
              :is="suite.Calendar"
              v-slot="calendarState"
              :class="classes('clv-date-picker__calendar')"
              v-bind="part('calendar', { open, disabled, readonly, value: modelValue, range })"
            >
              <component
                :is="suite.Header"
                :class="classes('clv-date-picker__header')"
                v-bind="part('header', { open, disabled, readonly, value: modelValue, range })"
              >
                <component
                  :is="suite.Prev"
                  :class="classes('clv-date-picker__nav')"
                  aria-label="Previous page"
                  v-bind="part('previous', { open, disabled, readonly, value: modelValue, range })"
                >
                  <slot
                    name="navigation-control"
                    direction="previous"
                    :state="calendarState"
                    :context="
                      slotContext('previous', {
                        open,
                        disabled,
                        readonly,
                        value: modelValue,
                        range,
                      })
                    "
                    >‹</slot
                  >
                </component>
                <component
                  :is="suite.Heading"
                  v-slot="headingState"
                  :class="classes('clv-date-picker__heading')"
                  v-bind="part('heading', { open, disabled, readonly, value: modelValue, range })"
                >
                  <slot
                    name="heading"
                    v-bind="headingState"
                    :state="calendarState"
                    :context="
                      slotContext('heading', {
                        open,
                        disabled,
                        readonly,
                        value: modelValue,
                        range,
                      })
                    "
                  >
                    {{ headingState.headingValue }}
                  </slot>
                </component>
                <component
                  :is="suite.Next"
                  :class="classes('clv-date-picker__nav')"
                  aria-label="Next page"
                  v-bind="part('next', { open, disabled, readonly, value: modelValue, range })"
                >
                  <slot
                    name="navigation-control"
                    direction="next"
                    :state="calendarState"
                    :context="
                      slotContext('next', { open, disabled, readonly, value: modelValue, range })
                    "
                    >›</slot
                  >
                </component>
              </component>
              <div
                :class="classes('clv-date-picker__months')"
                v-bind="part('months', { open, disabled, readonly, value: modelValue, range })"
              >
                <component
                  :is="suite.Grid"
                  v-for="(month, monthIndex) in calendarState.grid"
                  :key="month.value.toString()"
                  :class="classes('clv-date-picker__grid')"
                  v-bind="
                    part('grid', {
                      month: month.value,
                      index: monthIndex,
                      open,
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
                      part('weekdays', {
                        month: month.value,
                        index: monthIndex,
                        open,
                        disabled,
                        readonly,
                        range,
                      })
                    "
                  >
                    <component
                      :is="suite.GridRow"
                      :class="classes('clv-date-picker__week')"
                      v-bind="
                        part('week', {
                          month: month.value,
                          index: -1,
                          open,
                          disabled,
                          readonly,
                          range,
                        })
                      "
                    >
                      <component
                        :is="suite.HeadCell"
                        v-for="(weekDay, weekdayIndex) in calendarState.weekDays"
                        :key="weekDay"
                        :class="classes('clv-date-picker__weekday')"
                        v-bind="
                          part('weekday', {
                            month: month.value,
                            index: weekdayIndex,
                            open,
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
                      :class="classes('clv-date-picker__week')"
                      v-bind="
                        part('week', {
                          month: month.value,
                          index: weekIndex,
                          open,
                          disabled,
                          readonly,
                          range,
                        })
                      "
                    >
                      <component
                        :is="suite.Cell"
                        v-for="(day, dayIndex) in week"
                        :key="day.toString()"
                        :date="day"
                        :class="classes('clv-date-picker__cell')"
                        v-bind="
                          part('cell', {
                            date: day,
                            month: month.value,
                            index: dayIndex,
                            open,
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
                            :class="classes('clv-date-picker__day')"
                            v-bind="
                              part('day', {
                                date: day,
                                month: month.value,
                                index: dayIndex,
                                open,
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
                                  open,
                                  disabled,
                                  readonly,
                                  range,
                                  ...cellState,
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
            </component>
          </slot>
          <slot
            name="footer"
            :close="close"
            :value="modelValue"
            :context="slotContext('footer', { open, disabled, readonly, value: modelValue, range })"
          />
        </component>
      </Teleport>
    </component>
    <span
      v-if="help || error"
      :id="descriptionId"
      :class="classes({ 'clv-date-picker__error': error })"
      v-bind="
        part('description', {
          open,
          disabled,
          readonly,
          invalid: Boolean(error),
          value: modelValue,
          range,
        })
      "
    >
      {{ error ?? help }}
    </span>
  </div>
</template>

<style lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
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
}
</style>
