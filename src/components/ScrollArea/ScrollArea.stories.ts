import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'

import ScrollArea from './ScrollArea.vue'

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  args: { type: 'always', orientation: 'vertical', maxHeight: 220 },
  render: (args) => ({
    components: { ScrollArea },
    setup: () => ({ args, rows: Array.from({ length: 20 }, (_, index) => index + 1) }),
    template: `<div style="width: 20rem">
      <ScrollArea v-bind="args">
        <div style="padding: 1rem">
          <p v-for="row in rows" :key="row">Activity item {{ row }}</p>
        </div>
      </ScrollArea>
    </div>`,
  }),
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Vertical: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Activity item 20')).toBeInTheDocument()
  },
}

export const Both: Story = { args: { orientation: 'both' } }
