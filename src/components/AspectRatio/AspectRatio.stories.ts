import type { Meta, StoryObj } from '@storybook/vue3-vite'

import AspectRatio from './AspectRatio.vue'

const meta = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  args: { ratio: 16 / 9, label: 'Media preview' },
  render: (args) => ({
    components: { AspectRatio },
    setup: () => ({ args }),
    template:
      '<div style="max-width: 32rem"><AspectRatio v-bind="args"><div style="display:grid;height:100%;place-items:center">16:9 content</div></AspectRatio></div>',
  }),
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Square: Story = { args: { ratio: 1, label: 'Square preview' } }
