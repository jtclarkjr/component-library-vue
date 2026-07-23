<script setup lang="ts">
import type { ClvDateRange, DateMatcher, DateValue } from '../../types'
import PeriodPickerBase from '../_shared/PeriodPickerBase.vue'

const model = defineModel<ClvDateRange>()
const props = withDefaults(
  defineProps<{
    label?: string
    locale?: string
    minValue?: DateValue
    maxValue?: DateValue
    disabled?: boolean
    readonly?: boolean
    preventDeselect?: boolean
    isMonthDisabled?: DateMatcher
    isMonthUnavailable?: DateMatcher
    allowNonContiguousRanges?: boolean
    maximumMonths?: number
    fixedDate?: 'start' | 'end'
  }>(),
  {
    label: 'Month range picker',
    locale: 'en-US',
    disabled: false,
    readonly: false,
    preventDeselect: false,
    allowNonContiguousRanges: false,
  },
)
</script>

<template>
  <PeriodPickerBase
    v-model="model"
    kind="month-range"
    v-bind="props"
    :is-period-disabled="isMonthDisabled"
    :is-period-unavailable="isMonthUnavailable"
    :maximum-periods="maximumMonths"
  >
    <template #heading="slotProps">
      <slot name="heading" v-bind="slotProps">{{ slotProps.headingValue }}</slot>
    </template>
    <template #navigation-control="slotProps">
      <slot name="navigation-control" v-bind="slotProps">
        {{ slotProps.direction === 'previous' ? '‹' : '›' }}
      </slot>
    </template>
    <template #cell="slotProps">
      <slot name="cell" v-bind="slotProps">{{ slotProps.monthValue }}</slot>
    </template>
  </PeriodPickerBase>
</template>
