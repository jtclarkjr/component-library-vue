import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'

import Spinner from './Spinner.vue'

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  args: {
    label: 'Loading results',
    size: 'md',
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('status', { name: 'Loading results' })).toBeVisible()
  },
}

export const Large: Story = {
  args: { size: 'lg' },
}

export const Decorative: Story = {
  args: { decorative: true },
}
