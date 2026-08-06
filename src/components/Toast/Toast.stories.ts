import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { ref } from 'vue'

import type { ToastItem } from '../../types'
import Toast from './Toast.vue'

const rootPart = fn(() => ({}))

const initialItems: ToastItem[] = [
  {
    id: 'deployed',
    title: 'Deployment complete',
    description: 'Production is running the latest version.',
    variant: 'success',
    actionLabel: 'View',
    duration: 30_000,
  },
]

const meta = {
  title: 'Components/Toast',
  component: Toast,
  args: {
    duration: 30_000,
    onAction: fn(),
    onDismiss: fn(),
    parts: { root: rootPart },
  },
  render: (args) => ({
    components: { Toast },
    setup() {
      const items = ref([...initialItems])
      return { args, items }
    },
    template: '<Toast v-model:items="items" v-bind="args" />',
  }),
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  play: async ({ args, canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    await expect(rootPart).toHaveBeenCalled()
    const title = await page.findByText('Deployment complete')
    await waitFor(() => expect(title).toBeVisible())
    await userEvent.click(page.getByRole('button', { name: 'View' }))
    await expect(args.onAction).toHaveBeenCalledOnce()
    await waitFor(() => expect(page.queryByText('Deployment complete')).not.toBeInTheDocument())
  },
}

export const Danger: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'aria-hidden-focus', enabled: false }],
      },
    },
  },
  render: (args) => ({
    components: { Toast },
    setup() {
      const items = ref<ToastItem[]>([
        { id: 'failed', title: 'Deployment failed', variant: 'danger', duration: 30_000 },
      ])
      return { args, items }
    },
    template: '<Toast v-model:items="items" v-bind="args" />',
  }),
}

export const CloseIconSlot: Story = {
  render: (args) => ({
    components: { Toast },
    setup() {
      const items = ref([...initialItems])
      return { args, items }
    },
    template: `
      <Toast v-model:items="items" v-bind="args">
        <template #close-icon="{ item, index, variant, context }">
          <span data-testid="toast-close-icon" :data-item="item.id" :data-index="index" :data-variant="variant" :data-part-name="context.part">dismiss</span>
        </template>
      </Toast>
    `,
  }),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    const icon = await page.findByTestId('toast-close-icon')
    await expect(icon).toHaveAttribute('data-item', 'deployed')
    await expect(icon).toHaveAttribute('data-index', '0')
    await expect(icon).toHaveAttribute('data-variant', 'success')
    await expect(icon).toHaveAttribute('data-part-name', 'close')
    await userEvent.click(page.getByRole('button', { name: 'Dismiss notification' }))
    await waitFor(() => expect(page.queryByText('Deployment complete')).not.toBeInTheDocument())
  },
}
