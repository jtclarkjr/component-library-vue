<script setup lang="ts">
import type { ClvDateRange, DateMatcher, DateValue } from '../../types'
import { useClvComponent } from '../../headless'
import type { YearRangePickerPartContext, YearRangePickerParts } from '../../parts'
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
    isYearDisabled?: DateMatcher
    isYearUnavailable?: DateMatcher
    allowNonContiguousRanges?: boolean
    maximumYears?: number
    fixedDate?: 'start' | 'end'
    yearsPerPage?: number
    unstyled?: boolean
    parts?: YearRangePickerParts
  }>(),
  {
    label: 'Year range picker',
    locale: 'en-US',
    disabled: false,
    readonly: false,
    preventDeselect: false,
    allowNonContiguousRanges: false,
    yearsPerPage: 12,
  },
)
const { unstyled: resolvedUnstyled } = useClvComponent<YearRangePickerPartContext>(
  'year-range-picker',
  props,
)
</script>

<template>
  <PeriodPickerBase
    v-model="model"
    kind="year-range"
    v-bind="props"
    :is-period-disabled="isYearDisabled"
    :is-period-unavailable="isYearUnavailable"
    :maximum-periods="maximumYears"
    :unstyled="resolvedUnstyled"
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
      <slot name="cell" v-bind="slotProps">{{ slotProps.value }}</slot>
    </template>
  </PeriodPickerBase>
</template>
