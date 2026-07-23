import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CalendarDate } from '@internationalized/date'
import { ref } from 'vue'

import Calendar from './Calendar.vue'

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: { label: 'Appointment date', fixedWeeks: true },
  render: (args) => ({
    components: { Calendar },
    setup() {
      const value = ref(new CalendarDate(2026, 7, 15))
      return { args, value }
    },
    template: '<Calendar v-model="value" v-bind="args" />',
  }),
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Multiple: Story = { args: { multiple: true, label: 'Available dates' } }
export const LocalizedAndBounded: Story = {
  args: {
    locale: 'fr-FR',
    weekStartsOn: 1,
    minValue: new CalendarDate(2026, 7, 10),
    maxValue: new CalendarDate(2026, 7, 22),
  },
}
