import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import ColorSlider from './ColorSlider.vue'

const meta = {
  title: 'Components/ColorSlider',
  component: ColorSlider,
  tags: ['autodocs'],
  args: { channel: 'hue', colorSpace: 'hsl' },
  render: (args) => ({
    components: { ColorSlider },
    setup() {
      const value = ref('#2f80ed')
      const committed = ref('')
      return { args, value, committed }
    },
    template:
      '<div><ColorSlider v-model="value" v-bind="args" @commit="committed = $event" /><output aria-label="Current color">{{ value }}</output></div>',
  }),
} satisfies Meta<typeof ColorSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const slider = canvas.getByRole('slider', { name: 'Hue' })
    await userEvent.click(slider)
    await userEvent.keyboard('{ArrowRight}')
    await expect(slider).toHaveFocus()
    await expect(canvas.getByRole('status', { name: 'Current color' })).not.toHaveTextContent(
      '#2f80ed',
    )
  },
}
export const VerticalAlpha: Story = {
  args: { channel: 'alpha', colorSpace: 'rgb', orientation: 'vertical' },
  render: (args) => ({
    components: { ColorSlider },
    setup() {
      const value = ref('#2f80ed80')
      return { args, value }
    },
    template: '<ColorSlider v-model="value" v-bind="args" />',
  }),
}
export const Inverted: Story = { args: { inverted: true } }
export const Disabled: Story = { args: { disabled: true } }
