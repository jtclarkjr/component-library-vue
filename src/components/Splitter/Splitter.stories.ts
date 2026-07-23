import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import Splitter from './Splitter.vue'

const panels = [
  { id: 'navigation', label: 'Navigation', defaultSize: 30, minSize: 20, collapsible: true },
  { id: 'editor', label: 'Editor', defaultSize: 70, minSize: 30 },
]

const meta = {
  title: 'Components/Splitter',
  component: Splitter,
  tags: ['autodocs'],
  args: { panels, onLayout: fn() },
  render: (args) => ({
    components: { Splitter },
    setup: () => ({ args }),
    template:
      '<div style="width:42rem;max-width:100%"><Splitter v-bind="args"><template #panel="{ panel, collapse, expand, isCollapsed }"><strong>{{ panel.label }}</strong><p>Resizable {{ panel.label.toLowerCase() }} content.</p><button v-if="panel.collapsible" @click="isCollapsed ? expand() : collapse()">{{ isCollapsed ? \'Expand\' : \'Collapse\' }}</button></template></Splitter></div>',
  }),
} satisfies Meta<typeof Splitter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = canvas.getByRole('separator', { name: 'Resize Navigation panel' })
    const before = handle.getAttribute('aria-valuenow')
    handle.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(handle).not.toHaveAttribute('aria-valuenow', before ?? '')
  },
}
export const Vertical: Story = { args: { direction: 'vertical' } }
