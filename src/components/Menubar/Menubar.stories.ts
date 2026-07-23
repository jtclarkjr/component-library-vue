import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import type { MenubarMenu } from '../../types'
import Menubar from './Menubar.vue'

const menus: MenubarMenu[] = [
  {
    value: 'file',
    label: 'File',
    entries: [
      { value: 'new', label: 'New document' },
      { value: 'open', label: 'Open…' },
      { type: 'separator', value: 'file-divider' },
      { value: 'close', label: 'Close' },
    ],
  },
  {
    value: 'view',
    label: 'View',
    entries: [
      { type: 'checkbox', value: 'sidebar', label: 'Sidebar', checked: true },
      {
        type: 'radio-group',
        value: 'zoom',
        selectedValue: '100',
        options: [
          { value: '75', label: '75%' },
          { value: '100', label: '100%' },
        ],
      },
    ],
  },
]

const meta = {
  title: 'Components/Menubar',
  component: Menubar,
  tags: ['autodocs'],
  args: { menus, onAction: fn() },
} satisfies Meta<typeof Menubar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('menuitem', { name: 'File' }))
    await userEvent.click(await page.findByRole('menuitem', { name: 'New document' }))
    await expect(args.onAction).toHaveBeenCalled()
  },
}
