import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CalendarDate } from '@internationalized/date'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { ref } from 'vue'

import DatePicker from './DatePicker.vue'

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: { label: 'Delivery date', help: 'Choose an available delivery day.' },
  render: (args) => ({
    components: { DatePicker },
    setup() {
      const value = ref(new CalendarDate(2026, 7, 15))
      const open = ref(false)
      return { args, value, open }
    },
    template:
      '<div style="width:22rem"><DatePicker v-model="value" v-model:open="open" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Open calendar' }))
    const dialog = await page.findByRole('dialog', { name: 'Open calendar' })
    await waitFor(() => expect(dialog).toBeVisible())
    await userEvent.keyboard('{Escape}')
    await expect(canvas.getByRole('button', { name: 'Open calendar' })).toHaveFocus()
  },
}
export const Invalid: Story = { args: { error: 'Choose a future date.' } }

export const VisualDefault: Story = {
  ...Default,
  tags: ['visual', '!autodocs'],
  play: undefined,
}

export const VisualOpen: Story = {
  ...Default,
  tags: ['visual', '!autodocs'],
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open calendar' }))
  },
}

export const VisualInvalid: Story = {
  ...Invalid,
  tags: ['visual', '!autodocs'],
  play: undefined,
}
