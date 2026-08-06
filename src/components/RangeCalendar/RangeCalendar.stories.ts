import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CalendarDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import { expect } from 'storybook/test'
import { ref } from 'vue'

import type { RangeCalendarParts } from '../../parts'
import RangeCalendar from './RangeCalendar.vue'

const stateParts = {
  day: ({ today, outside, unavailable, rangeStart, rangeEnd, selected }) => ({
    'data-context-today': String(Boolean(today)),
    'data-context-outside': String(Boolean(outside)),
    'data-context-unavailable': String(Boolean(unavailable)),
    'data-context-range-start': String(Boolean(rangeStart)),
    'data-context-range-end': String(Boolean(rangeEnd)),
    'data-context-selected': String(Boolean(selected)),
  }),
} satisfies RangeCalendarParts

const meta = {
  title: 'Components/RangeCalendar',
  component: RangeCalendar,
  tags: ['autodocs'],
  args: { label: 'Travel dates', numberOfMonths: 2, fixedWeeks: true, maximumDays: 14 },
  render: (args) => ({
    components: { RangeCalendar },
    setup() {
      const value = ref({
        start: new CalendarDate(2026, 7, 10),
        end: new CalendarDate(2026, 7, 15),
      })
      return { args, value }
    },
    template: '<RangeCalendar v-model="value" v-bind="args" />',
  }),
} satisfies Meta<typeof RangeCalendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const UnavailableDates: Story = {
  args: { isDateUnavailable: (date: DateValue) => date.day === 13 },
}
export const PartResolverState: Story = {
  args: {
    isDateUnavailable: (date: DateValue) => date.day === 13,
    parts: stateParts,
  },
  play: async ({ canvasElement }) => {
    const days = [...canvasElement.querySelectorAll<HTMLElement>('[data-part="day"]')]
    await expect(days.length).toBeGreaterThan(0)
    for (const day of days) {
      await expect(day.dataset.contextToday).toBe(String(day.hasAttribute('data-today')))
      await expect(day.dataset.contextOutside).toBe(String(day.hasAttribute('data-outside-view')))
      await expect(day.dataset.contextUnavailable).toBe(
        String(day.hasAttribute('data-unavailable')),
      )
      await expect(day.dataset.contextRangeStart).toBe(
        String(day.hasAttribute('data-highlighted-start')),
      )
      await expect(day.dataset.contextRangeEnd).toBe(
        String(day.hasAttribute('data-highlighted-end')),
      )
      if (!day.hasAttribute('data-unavailable')) {
        await expect(day.dataset.contextSelected).toBe(String(day.hasAttribute('data-selected')))
      }
    }
  },
}
