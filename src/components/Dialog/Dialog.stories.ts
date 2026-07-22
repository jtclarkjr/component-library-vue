import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Button from '../Button/Button.vue'
import Dialog from './Dialog.vue'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  args: {
    title: 'Invite collaborator',
    description: 'They will receive access immediately.',
    size: 'md',
  },
  render: (args) => ({
    components: { Button, Dialog },
    setup: () => ({ args }),
    template: `<Dialog v-bind="args">
      <template #trigger><Button>Open dialog</Button></template>
      <p>Dialog content is composed through slots.</p>
      <template #footer><Button variant="secondary">Cancel</Button></template>
    </Dialog>`,
  }),
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }))

    const dialog = await page.findByRole('dialog')
    await waitFor(() => expect(dialog).toBeVisible())
    await expect(page.getByRole('heading', { name: 'Invite collaborator' })).toBeVisible()
    await expect(dialog).toHaveAccessibleDescription('They will receive access immediately.')

    await userEvent.click(page.getByRole('button', { name: 'Close dialog' }))
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument())
  },
}

export const Small: Story = {
  args: { size: 'sm' },
}

export const Large: Story = {
  args: { size: 'lg' },
}
