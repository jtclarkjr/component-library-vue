<script setup lang="ts">
import type { DateMatcher, DateValue } from '../../types'
import PeriodPickerBase from '../_shared/PeriodPickerBase.vue'

const model = defineModel<DateValue | DateValue[] | null>()
const props = withDefaults(
  defineProps<{
    label?: string
    locale?: string
    minValue?: DateValue
    maxValue?: DateValue
    disabled?: boolean
    readonly?: boolean
    multiple?: boolean
    preventDeselect?: boolean
    isMonthDisabled?: DateMatcher
    isMonthUnavailable?: DateMatcher
  }>(),
  {
    label: 'Month picker',
    locale: 'en-US',
    disabled: false,
    readonly: false,
    multiple: false,
    preventDeselect: false,
  },
)
</script>

<template>
  <PeriodPickerBase
    v-model="model"
    kind="month"
    v-bind="props"
    :is-period-disabled="isMonthDisabled"
    :is-period-unavailable="isMonthUnavailable"
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
