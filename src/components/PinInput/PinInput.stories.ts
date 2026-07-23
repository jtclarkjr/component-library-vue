import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import PinInput from './PinInput.vue'

const meta = {
  title: 'Components/PinInput',
  component: PinInput,
  tags: ['autodocs'],
  args: { length: 4, label: 'Verification code', help: 'Enter the four-digit code.', otp: true },
  render: (args) => ({
    components: { PinInput },
    setup() {
      const value = ref<string[]>([])
      return { args, value }
    },
    template: '<PinInput v-model="value" v-bind="args" />',
  }),
} satisfies Meta<typeof PinInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const digits = canvas.getAllByRole('textbox')
    await userEvent.type(digits[0]!, '1234')
    await expect(digits[3]).toHaveValue('4')
  },
}
export const Masked: Story = { args: { mask: true, label: 'Security PIN' } }
export const Disabled: Story = { args: { disabled: true } }
