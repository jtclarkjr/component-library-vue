import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CalendarDate } from '@internationalized/date'
import { ref } from 'vue'

import YearPicker from './YearPicker.vue'

const meta = {
  title: 'Components/YearPicker',
  component: YearPicker,
  tags: ['autodocs'],
  args: { label: 'Fiscal year', yearsPerPage: 12 },
  render: (args) => ({
    components: { YearPicker },
    setup() {
      const value = ref(new CalendarDate(2026, 1, 1))
      return { args, value }
    },
    template: '<YearPicker v-model="value" v-bind="args" />',
  }),
} satisfies Meta<typeof YearPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Bounded: Story = {
  args: { minValue: new CalendarDate(2020, 1, 1), maxValue: new CalendarDate(2030, 1, 1) },
}
