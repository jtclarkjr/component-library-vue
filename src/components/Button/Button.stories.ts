import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import Button from './Button.vue'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    variant: 'primary',
    size: 'md',
    onClick: fn(),
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Save changes</Button>',
  }),
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Danger: Story = {
  args: { variant: 'danger' },
}

export const SurfaceIcon: Story = {
  args: { variant: 'surface', size: 'icon' },
}

export const Loading: Story = {
  args: { loading: true, onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Save changes' })
    const loader = button.querySelector('[data-part="loader"]')
    await expect(button).toHaveAttribute('aria-busy', 'true')
    await expect(button).toBeDisabled()
    await expect(loader).toHaveAttribute('data-clv-component', 'button')
    await expect(loader).toHaveAttribute('data-part', 'loader')
    await expect(loader).toHaveClass('clv-spinner', 'clv-spinner--sm')
    await userEvent.click(button)
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const DisabledLink: Story = {
  args: { as: 'a', disabled: true, onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByText('Save changes')
    await expect(link).toHaveAttribute('aria-disabled', 'true')
    await expect(link).toHaveAttribute('tabindex', '-1')
    await userEvent.click(link)
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}
