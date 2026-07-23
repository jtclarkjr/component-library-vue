import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CalendarDate } from '@internationalized/date'
import { ref } from 'vue'

import YearRangePicker from './YearRangePicker.vue'

const meta = {
  title: 'Components/YearRangePicker',
  component: YearRangePicker,
  tags: ['autodocs'],
  args: { label: 'Plan years', maximumYears: 5, yearsPerPage: 12 },
  render: (args) => ({
    components: { YearRangePicker },
    setup() {
      const value = ref({
        start: new CalendarDate(2025, 1, 1),
        end: new CalendarDate(2028, 1, 1),
      })
      return { args, value }
    },
    template: '<YearRangePicker v-model="value" v-bind="args" />',
  }),
} satisfies Meta<typeof YearRangePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const NonLinear: Story = { args: { allowNonContiguousRanges: true } }
