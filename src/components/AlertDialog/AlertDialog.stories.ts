import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import Button from '../Button/Button.vue'
import AlertDialog from './AlertDialog.vue'

const meta = {
  title: 'Components/AlertDialog',
  component: AlertDialog,
  args: {
    title: 'Delete project?',
    description: 'This action cannot be undone.',
    confirmLabel: 'Delete project',
    variant: 'danger',
    onConfirm: fn(),
  },
  render: (args) => ({
    components: { AlertDialog, Button },
    setup: () => ({ args }),
    template: `<AlertDialog v-bind="args">
      <template #trigger><Button variant="danger">Delete project</Button></template>
      <p>All environments and deployment history will be removed.</p>
    </AlertDialog>`,
  }),
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Destructive: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Delete project' }))
    const dialog = await page.findByRole('alertdialog')
    await expect(dialog).toHaveAccessibleDescription('This action cannot be undone.')
    await userEvent.click(page.getByRole('button', { name: 'Delete project' }))
    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await waitFor(() => expect(page.queryByRole('alertdialog')).not.toBeInTheDocument())
  },
}

export const Loading: Story = { args: { loading: true } }
