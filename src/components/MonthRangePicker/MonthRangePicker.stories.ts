import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CalendarDate } from '@internationalized/date'
import { ref } from 'vue'

import MonthRangePicker from './MonthRangePicker.vue'

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
