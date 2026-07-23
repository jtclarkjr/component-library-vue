import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import Toolbar from './Toolbar.vue'

const entries = [
  { value: 'undo', label: 'Undo' },
  { value: 'redo', label: 'Redo', disabled: true },
  { type: 'separator' as const, value: 'divider' },
  { type: 'toggle' as const, value: 'bold', label: 'Bold', pressed: true },
  { type: 'link' as const, value: 'help', label: 'Help', href: '#help' },
  { value: 'delete', label: 'Delete', destructive: true },
]

const meta = {
  title: 'Components/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  args: { entries, label: 'Editor tools', onAction: fn(), onToggle: fn() },
} satisfies Meta<typeof Toolbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Undo' }))
    await expect(args.onAction).toHaveBeenCalled()
    await expect(canvas.getByRole('button', { name: 'Redo' })).toBeDisabled()
  },
}
export const Vertical: Story = { args: { orientation: 'vertical' } }
