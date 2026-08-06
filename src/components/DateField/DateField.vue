<script setup lang="ts">
import { useClvComponent } from '../../headless'
import type { DateFieldPartContext, DateFieldParts } from '../../parts'
import type { DateMatcher, DateStep, DateValue } from '../../types'
import DateFieldBase from '../_shared/DateFieldBase.vue'

const model = defineModel<DateValue | null>()
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
    isDateUnavailable?: DateMatcher
    unstyled?: boolean
    parts?: DateFieldParts
  }>(),
  {
    required: false,
    disabled: false,
    readonly: false,
    locale: 'en-US',
    hourCycle: 24,
    granularity: 'day',
    stepSnapping: false,
    hideTimeZone: false,
  },
)
const { unstyled: resolvedUnstyled } = useClvComponent<DateFieldPartContext>('date-field', props)

function segmentValue(slotProps: unknown) {
  return (slotProps as { value?: string }).value ?? ''
}
</script>

<template>
  <DateFieldBase
    v-model="model"
    kind="date"
    component-name="date-field"
    v-bind="props"
    :unstyled="resolvedUnstyled"
    :unavailable="isDateUnavailable"
  >
    <template #segment="slotProps">
      <slot name="segment" v-bind="slotProps">{{ segmentValue(slotProps) }}</slot>
    </template>
  </DateFieldBase>
</template>
