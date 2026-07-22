import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Accordion from './Accordion.vue'

const items = [
  { value: 'account', title: 'Account', content: 'Manage your profile and sign-in details.' },
  { value: 'billing', title: 'Billing', content: 'Review invoices and payment methods.' },
  { value: 'security', title: 'Security', content: 'Configure passkeys and recovery options.' },
]

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  args: { items, type: 'single', collapsible: true },
  decorators: [() => ({ template: '<div style="width: 28rem"><story /></div>' })],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Account/ }))
    await waitFor(() =>
      expect(canvas.getByText('Manage your profile and sign-in details.')).toBeVisible(),
    )
  },
}

export const Multiple: Story = { args: { type: 'multiple' } }
