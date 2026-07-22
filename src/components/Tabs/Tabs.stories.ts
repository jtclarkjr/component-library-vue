import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'

import Tabs from './Tabs.vue'

const items = [
  { value: 'profile', label: 'Profile', content: 'Edit your public profile.' },
  { value: 'security', label: 'Security', content: 'Manage passkeys and sessions.' },
  { value: 'billing', label: 'Billing', content: 'Review invoices.' },
]

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: { items, orientation: 'horizontal' },
  decorators: [() => ({ template: '<div style="width: 32rem"><story /></div>' })],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Security' }))
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Manage passkeys and sessions.')
  },
}

export const Vertical: Story = { args: { orientation: 'vertical' } }
