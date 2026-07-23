import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import type { NavigationMenuItem } from '../../types'
import NavigationMenu from './NavigationMenu.vue'

const items: NavigationMenuItem[] = [
  {
    value: 'products',
    label: 'Products',
    children: [
      {
        value: 'analytics',
        label: 'Analytics',
        href: '#analytics',
        description: 'Explore product signals.',
      },
      {
        value: 'platform',
        label: 'Platform',
        description: 'Build with shared primitives.',
        children: [{ value: 'api', label: 'API', href: '#api' }],
      },
    ],
  },
  { value: 'about', label: 'About', href: '#' },
]

const meta = {
  title: 'Components/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  args: { items, delayDuration: 0 },
} satisfies Meta<typeof NavigationMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: /Products/ })
    await userEvent.hover(trigger)
    await expect(await canvas.findByRole('link', { name: /Analytics/ })).toBeVisible()
    await userEvent.unhover(trigger)
    await waitFor(() =>
      expect(canvas.queryByRole('link', { name: /Analytics/ })).not.toBeInTheDocument(),
    )
  },
}
export const Vertical: Story = { args: { orientation: 'vertical' } }
