import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CalendarDate, CalendarDateTime } from '@internationalized/date'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import DateField from './DateField.vue'

const meta = {
  title: 'Components/DateField',
  component: DateField,
  tags: ['autodocs'],
  args: { label: 'Start date', help: 'Use the arrow keys to adjust each segment.' },
  render: (args) => ({
    components: { DateField },
    setup() {
      const value = ref(new CalendarDate(2026, 7, 15))
      return { args, value }
    },
    template: '<div style="width:20rem"><DateField v-model="value" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof DateField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const segments = canvas.getAllByRole('spinbutton')
    await userEvent.click(segments[0]!)
    await userEvent.keyboard('{ArrowUp}')
    await expect(segments[0]!).toHaveFocus()
  },
}
export const DateAndTime: Story = {
  args: { granularity: 'minute' },
  render: (args) => ({
    components: { DateField },
    setup() {
      const value = ref(new CalendarDateTime(2026, 7, 15, 9, 30))
      return { args, value }
    },
    template: '<div style="width:24rem"><DateField v-model="value" v-bind="args" /></div>',
  }),
}
export const Invalid: Story = { args: { error: 'Choose a date in the available range.' } }
