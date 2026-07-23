<script setup lang="ts">
import type { DateMatcher, DateStep, DateValue } from '../../types'
import DatePickerBase from '../_shared/DatePickerBase.vue'

const model = defineModel<DateValue | null>()
const open = defineModel<boolean>('open', { default: false })
const props = withDefaults(
  defineProps<{
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
    closeOnSelect?: boolean
    modal?: boolean
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
  }>(),
  {
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
    closeOnSelect: true,
    modal: false,
    side: 'bottom',
    align: 'start',
    sideOffset: 6,
  },
)
</script>

<template>
  <DatePickerBase v-model="model" v-model:open="open" v-bind="props">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </DatePickerBase>
</template>
