import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { ref } from 'vue'

import Button from '../Button/Button.vue'
import Drawer from './Drawer.vue'

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: { title: 'Workspace settings', description: 'Manage access and notifications.' },
  render: (args) => ({
    components: { Button, Drawer },
    setup() {
      const open = ref(false)
      return { args, open }
    },
    template: `<Drawer v-model:open="open" v-bind="args">
      <template #trigger><Button>Open settings</Button></template>
      <template #body><p>Drawer content stays scrollable and focus managed.</p><label>Workspace name <input /></label></template>
      <template #footer="{ close }"><Button variant="secondary" @click="close">Done</Button></template>
    </Drawer>`,
  }),
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole('button', { name: 'Open settings' })
    await userEvent.click(trigger)
    const dialog = await page.findByRole('dialog', { name: 'Workspace settings' })
    await waitFor(() => expect(dialog).toBeVisible())
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
export const FromRight: Story = { args: { direction: 'right' } }
export const SnapPoints: Story = {
  args: { snapPoints: [0.35, 0.7, 1], snapToSequentialPoints: true },
}
