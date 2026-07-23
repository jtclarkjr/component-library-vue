import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Label from './Label.vue'

const meta = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  args: { for: 'project-name', required: true },
  render: (args) => ({
    components: { Label },
    setup: () => ({ args }),
    template:
      '<div style="display:grid;gap:.5rem"><Label v-bind="args">Project name</Label><input id="project-name" /></div>',
  }),
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Sizes: Story = {
  render: () => ({
    components: { Label },
    template:
      '<div style="display:grid;gap:1rem"><Label size="sm">Small label</Label><Label>Medium label</Label><Label size="lg">Large label</Label></div>',
  }),
}
