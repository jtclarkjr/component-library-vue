import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Time } from '@internationalized/date'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import TimeField from './TimeField.vue'

const meta = {
  title: 'Components/TimeField',
  component: TimeField,
  tags: ['autodocs'],
  args: { label: 'Meeting time', help: 'Times use five-minute increments.', step: { minute: 5 } },
  render: (args) => ({
    components: { TimeField },
    setup() {
      const value = ref(new Time(9, 30))
      return { args, value }
    },
    template: '<div style="width:18rem"><TimeField v-model="value" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof TimeField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const segments = canvas.getAllByRole('spinbutton')
    await userEvent.click(segments[1]!)
    await userEvent.keyboard('{ArrowUp}')
    await expect(segments[1]!).toHaveFocus()
  },
}
export const TwelveHour: Story = { args: { hourCycle: 12 } }
export const Disabled: Story = { args: { disabled: true } }
