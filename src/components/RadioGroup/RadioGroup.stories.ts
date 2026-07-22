import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import RadioGroup from './RadioGroup.vue'

const options = [
  { value: 'email', label: 'Email', description: 'Receive a message in your inbox.' },
  { value: 'push', label: 'Push notification' },
  { value: 'sms', label: 'SMS', disabled: true },
]

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  args: { options, label: 'Notification channel', help: 'Choose one option.' },
  render: (args) => ({
    components: { RadioGroup },
    setup() {
      const value = ref('email')
      return { args, value }
    },
    template: '<RadioGroup v-model="value" v-bind="args" />',
  }),
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const push = canvas.getByRole('radio', { name: 'Push notification' })
    await userEvent.click(push)
    await expect(push).toBeChecked()
  },
}

export const Horizontal: Story = { args: { orientation: 'horizontal' } }
