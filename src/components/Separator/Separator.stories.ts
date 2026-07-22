import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'

import Separator from './Separator.vue'

const meta = {
  title: 'Components/Separator',
  component: Separator,
  decorators: [() => ({ template: '<div style="width: 18rem"><story /></div>' })],
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Decorative: Story = {}

export const Semantic: Story = {
  args: { decorative: false, label: 'Account settings' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('separator')).toHaveAccessibleName(
      'Account settings',
    )
  },
}
