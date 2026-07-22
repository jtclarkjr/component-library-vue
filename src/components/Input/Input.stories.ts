import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'

import Input from './Input.vue'

const meta = {
  title: 'Components/Input',
  component: Input,
  args: {
    label: 'Email address',
    help: 'We will only use this for account notifications.',
    placeholder: 'you@example.com',
    type: 'email',
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Email address' })
    await userEvent.type(input, 'hello@example.com')
    await expect(input).toHaveValue('hello@example.com')
    await expect(input).toHaveAccessibleDescription(
      'We will only use this for account notifications.',
    )
  },
}

export const Invalid: Story = {
  args: {
    help: undefined,
    error: 'Enter a valid email address.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Email address' })
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAccessibleDescription('Enter a valid email address.')
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}
