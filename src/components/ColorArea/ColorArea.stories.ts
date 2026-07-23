import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import ColorArea from './ColorArea.vue'

const meta = {
  title: 'Components/ColorArea',
  component: ColorArea,
  tags: ['autodocs'],
  args: { ariaLabel: 'Brand color area', colorSpace: 'hsl' },
  render: (args) => ({
    components: { ColorArea },
    setup() {
      const value = ref('#2f80ed')
      const committed = ref('')
      return { args, value, committed }
    },
    template:
      '<div><ColorArea v-model="value" v-bind="args" @commit="committed = $event" /><output aria-label="Current color">{{ value }}</output></div>',
  }),
} satisfies Meta<typeof ColorArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const thumb = canvas.getByRole('slider', { name: 'Saturation, Lightness' })
    await userEvent.click(thumb)
    await userEvent.keyboard('{ArrowRight}{ArrowUp}')
    await expect(thumb).toHaveFocus()
    await expect(canvas.getByRole('status', { name: 'Current color' })).not.toHaveTextContent(
      '#2f80ed',
    )
  },
}
export const Disabled: Story = { args: { disabled: true } }
export const Readonly: Story = { args: { readonly: true } }
