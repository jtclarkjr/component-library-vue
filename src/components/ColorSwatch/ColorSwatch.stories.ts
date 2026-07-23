import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ColorSwatch from './ColorSwatch.vue'

const meta = {
  title: 'Components/ColorSwatch',
  component: ColorSwatch,
  tags: ['autodocs'],
  args: { color: '#2f80ed', label: 'Ocean blue' },
} satisfies Meta<typeof ColorSwatch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Transparent: Story = { args: { color: '#ff4d6d80', label: 'Transparent coral' } }
export const Sizes: Story = {
  render: () => ({
    components: { ColorSwatch },
    template: `<div style="display:flex;gap:1rem;align-items:center">
      <ColorSwatch color="#74e0c1" label="Small mint" size="sm" />
      <ColorSwatch color="#74e0c1" label="Medium mint" size="md" />
      <ColorSwatch color="#74e0c1" label="Large mint" size="lg" rounded />
    </div>`,
  }),
}
