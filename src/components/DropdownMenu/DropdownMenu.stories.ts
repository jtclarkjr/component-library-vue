import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import Button from '../Button/Button.vue'
import DropdownMenu from './DropdownMenu.vue'

const items = [
  { value: 'edit', label: 'Edit project' },
  { value: 'duplicate', label: 'Duplicate' },
  { type: 'separator' as const, value: 'divider' },
  { value: 'delete', label: 'Delete', destructive: true },
]

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  args: { items, onSelect: fn() },
  render: (args) => ({
    components: { Button, DropdownMenu },
    setup: () => ({ args }),
    template: `<DropdownMenu v-bind="args">
      <template #trigger><Button variant="secondary">Project actions</Button></template>
    </DropdownMenu>`,
  }),
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole('button', { name: 'Project actions' })
    await userEvent.click(trigger)
    await userEvent.click(await page.findByRole('menuitem', { name: 'Edit project' }))
    await expect(args.onSelect).toHaveBeenCalledOnce()
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
