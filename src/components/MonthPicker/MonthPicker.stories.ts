import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CalendarDate } from '@internationalized/date'
import { ref } from 'vue'

import MonthPicker from './MonthPicker.vue'

const meta = {
  title: 'Components/MonthPicker',
  component: MonthPicker,
  tags: ['autodocs'],
  args: { label: 'Billing month' },
  render: (args) => ({
    components: { MonthPicker },
    setup() {
      const value = ref(new CalendarDate(2026, 7, 1))
      return { args, value }
    },
    template: '<MonthPicker v-model="value" v-bind="args" />',
  }),
} satisfies Meta<typeof MonthPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Multiple: Story = { args: { multiple: true, label: 'Active months' } }
export const Localized: Story = { args: { locale: 'ja-JP' } }
