import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'

import Avatar from './Avatar.vue'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  args: { alt: 'Ada Lovelace', fallback: 'AL', size: 'md', shape: 'circle' },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Fallback: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('AL')).toBeVisible()
  },
}

export const Rounded: Story = { args: { shape: 'rounded', size: 'lg' } }
