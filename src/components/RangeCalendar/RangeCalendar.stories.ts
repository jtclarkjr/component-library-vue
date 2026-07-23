import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CalendarDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import { ref } from 'vue'

import RangeCalendar from './RangeCalendar.vue'

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
