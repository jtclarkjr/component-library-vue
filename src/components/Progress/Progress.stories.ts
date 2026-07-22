import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'

import Progress from './Progress.vue'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  args: { value: 64, max: 100, label: 'Upload progress', showValue: true, size: 'md' },
  decorators: [() => ({ template: '<div style="width: 20rem"><story /></div>' })],
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Determinate: Story = {
  play: async ({ canvasElement }) => {
    const progress = within(canvasElement).getByRole('progressbar', { name: 'Upload progress' })
    await expect(progress).toHaveAttribute('aria-valuenow', '64')
  },
}

export const Indeterminate: Story = { args: { value: null, showValue: false } }
export const Success: Story = { args: { value: 100, variant: 'success' } }
