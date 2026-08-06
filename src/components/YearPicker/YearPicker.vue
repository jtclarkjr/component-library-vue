<script setup lang="ts">
import type { DateMatcher, DateValue } from '../../types'
import { useClvComponent } from '../../headless'
import type { YearPickerPartContext, YearPickerParts } from '../../parts'
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
    isYearDisabled?: DateMatcher
    isYearUnavailable?: DateMatcher
    yearsPerPage?: number
    unstyled?: boolean
    parts?: YearPickerParts
  }>(),
  {
    label: 'Year picker',
    locale: 'en-US',
    disabled: false,
    readonly: false,
    multiple: false,
    preventDeselect: false,
    yearsPerPage: 12,
  },
)
const { unstyled: resolvedUnstyled } = useClvComponent<YearPickerPartContext>('year-picker', props)
</script>

<template>
  <PeriodPickerBase
    v-model="model"
    kind="year"
    v-bind="props"
    :is-period-disabled="isYearDisabled"
    :is-period-unavailable="isYearUnavailable"
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
