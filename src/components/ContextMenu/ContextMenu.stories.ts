import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import type { MenuEntry } from '../../types'
import ContextMenu from './ContextMenu.vue'

const items: MenuEntry[] = [
  { value: 'open', label: 'Open' },
  { type: 'checkbox', value: 'favorite', label: 'Favorite', checked: false },
  {
    type: 'submenu',
    value: 'move',
    label: 'Move to',
    items: [
      { value: 'archive', label: 'Archive' },
      { value: 'trash', label: 'Trash', destructive: true },
    ],
  },
]

const meta = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  args: { items, onAction: fn(), onCheckboxChange: fn() },
  render: (args) => ({
    components: { ContextMenu },
    setup: () => ({ args }),
    template:
      '<ContextMenu v-bind="args"><template #trigger><div style="display:grid;width:24rem;height:10rem;place-items:center;border:1px dashed #64748b;border-radius:.75rem">Right-click this surface</div></template></ContextMenu>',
  }),
} satisfies Meta<typeof ContextMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.pointer({
      target: canvas.getByText('Right-click this surface'),
      keys: '[MouseRight]',
    })
    await userEvent.click(await page.findByRole('menuitem', { name: 'Open' }))
    await expect(args.onAction).toHaveBeenCalled()
  },
}
