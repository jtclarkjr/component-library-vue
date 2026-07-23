import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CalendarDate } from '@internationalized/date'
import { ref } from 'vue'

import DateRangeField from './DateRangeField.vue'

const meta = {
  title: 'Components/DateRangeField',
  component: DateRangeField,
  tags: ['autodocs'],
  args: { label: 'Booking dates', help: 'Start and end dates are edited independently.' },
  render: (args) => ({
    components: { DateRangeField },
    setup() {
      const value = ref({
        start: new CalendarDate(2026, 7, 10),
        end: new CalendarDate(2026, 7, 15),
      })
      return { args, value }
    },
    template: '<div style="width:28rem"><DateRangeField v-model="value" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof DateRangeField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Readonly: Story = { args: { readonly: true } }
export const Invalid: Story = { args: { error: 'The end date must follow the start date.' } }
