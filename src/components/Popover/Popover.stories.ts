import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Button from '../Button/Button.vue'
import Popover from './Popover.vue'

const meta = {
  title: 'Components/Popover',
  component: Popover,
  render: (args) => ({
    components: { Button, Popover },
    setup: () => ({ args }),
    template: `<Popover v-bind="args">
      <template #trigger><Button variant="secondary">Open details</Button></template>
      <template #default="{ close }">
        <strong>Deployment details</strong>
        <p>Production was updated two minutes ago.</p>
        <Button size="sm" @click="close">Done</Button>
      </template>
    </Popover>`,
  }),
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Open details' }))
    await expect(await page.findByText('Deployment details')).toBeVisible()
    await userEvent.click(page.getByRole('button', { name: 'Done' }))
    await waitFor(() => expect(page.queryByText('Deployment details')).not.toBeInTheDocument())
  },
}
