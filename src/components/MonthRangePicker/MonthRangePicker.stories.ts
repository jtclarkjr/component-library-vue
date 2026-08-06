import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CalendarDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import { expect } from 'storybook/test'
import { ref } from 'vue'

import type { MonthRangePickerParts } from '../../parts'
import MonthRangePicker from './MonthRangePicker.vue'

const stateParts = {
  option: ({ today, unavailable, rangeStart, rangeEnd, selected }) => ({
    'data-context-today': String(Boolean(today)),
    'data-context-unavailable': String(Boolean(unavailable)),
    'data-context-range-start': String(Boolean(rangeStart)),
    'data-context-range-end': String(Boolean(rangeEnd)),
    'data-context-selected': String(Boolean(selected)),
  }),
} satisfies MonthRangePickerParts

const meta = {
  title: 'Components/MonthRangePicker',
  component: MonthRangePicker,
  tags: ['autodocs'],
  args: { label: 'Reporting period', maximumMonths: 6 },
  render: (args) => ({
    components: { MonthRangePicker },
    setup() {
      const value = ref({
        start: new CalendarDate(2026, 3, 1),
        end: new CalendarDate(2026, 7, 1),
      })
      return { args, value }
    },
    template: '<MonthRangePicker v-model="value" v-bind="args" />',
  }),
} satisfies Meta<typeof MonthRangePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }
export const PartResolverState: Story = {
  args: {
    isMonthUnavailable: (date: DateValue) => date.month === 5,
    parts: stateParts,
  },
  play: async ({ canvasElement }) => {
    const options = [...canvasElement.querySelectorAll<HTMLElement>('[data-part="option"]')]
    await expect(options.length).toBeGreaterThan(0)
    for (const option of options) {
      await expect(option.dataset.contextToday).toBe(String(option.hasAttribute('data-today')))
      await expect(option.dataset.contextUnavailable).toBe(
        String(option.hasAttribute('data-unavailable')),
      )
      await expect(option.dataset.contextRangeStart).toBe(
        String(option.hasAttribute('data-selection-start')),
      )
      await expect(option.dataset.contextRangeEnd).toBe(
        String(option.hasAttribute('data-selection-end')),
      )
      if (!option.hasAttribute('data-unavailable')) {
        await expect(option.dataset.contextSelected).toBe(
          String(option.hasAttribute('data-selected')),
        )
      }
    }
  },
}
