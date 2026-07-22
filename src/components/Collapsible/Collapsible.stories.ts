import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'

import Collapsible from './Collapsible.vue'

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  args: { title: 'Advanced settings' },
  render: (args) => ({
    components: { Collapsible },
    setup: () => ({ args }),
    template: '<Collapsible v-bind="args"><p>Additional configuration options.</p></Collapsible>',
  }),
  decorators: [() => ({ template: '<div style="width: 28rem"><story /></div>' })],
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Advanced settings/ }))
    await expect(canvas.getByText('Additional configuration options.')).toBeVisible()
  },
}

export const Disabled: Story = { args: { disabled: true } }
