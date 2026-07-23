<script setup lang="ts">
import type { DateStep, TimeValue } from '../../types'
import DateFieldBase from '../_shared/DateFieldBase.vue'

const model = defineModel<TimeValue | null>()
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
    granularity?: 'hour' | 'minute' | 'second'
    step?: DateStep
    stepSnapping?: boolean
    hideTimeZone?: boolean
    minValue?: TimeValue
    maxValue?: TimeValue
    placeholder?: TimeValue
    isTimeUnavailable?: (time: TimeValue) => boolean
  }>(),
  {
    required: false,
    disabled: false,
    readonly: false,
    locale: 'en-US',
    hourCycle: 24,
    granularity: 'minute',
    stepSnapping: false,
    hideTimeZone: false,
  },
)
</script>

<template>
  <DateFieldBase v-model="model" kind="time" v-bind="props" :unavailable="isTimeUnavailable">
    <template #segment="slotProps">
      <slot name="segment" v-bind="slotProps">{{ slotProps.value }}</slot>
    </template>
  </DateFieldBase>
</template>
