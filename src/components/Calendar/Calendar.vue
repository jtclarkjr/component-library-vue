<script setup lang="ts">
import type { DateMatcher, DateValue } from '../../types'
import DayCalendarBase from '../_shared/DayCalendarBase.vue'

const model = defineModel<DateValue | DateValue[] | null>()
const props = withDefaults(
  defineProps<{
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
  }>(),
  {
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
  },
)
</script>

<template>
  <DayCalendarBase v-model="model" v-bind="props">
    <template #heading="slotProps">
      <slot name="heading" v-bind="slotProps">{{ slotProps.headingValue }}</slot>
    </template>
    <template #navigation-control="slotProps">
      <slot name="navigation-control" v-bind="slotProps">
        {{ slotProps.direction === 'previous' ? '‹' : '›' }}
      </slot>
    </template>
    <template #cell="slotProps">
      <slot name="cell" v-bind="slotProps">{{ slotProps.dayValue }}</slot>
    </template>
  </DayCalendarBase>
</template>
