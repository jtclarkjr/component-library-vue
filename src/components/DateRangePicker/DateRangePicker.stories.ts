import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CalendarDate } from '@internationalized/date'
import { ref } from 'vue'

import DateRangePicker from './DateRangePicker.vue'

const meta = {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  args: { label: 'Travel dates', numberOfMonths: 2, maximumDays: 21 },
  render: (args) => ({
    components: { DateRangePicker },
    setup() {
      const value = ref({
        start: new CalendarDate(2026, 7, 10),
        end: new CalendarDate(2026, 7, 15),
      })
      const open = ref(false)
      return { args, value, open }
    },
    template:
      '<div style="width:32rem"><DateRangePicker v-model="value" v-model:open="open" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof DateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Localized: Story = { args: { locale: 'de-DE', weekStartsOn: 1 } }
