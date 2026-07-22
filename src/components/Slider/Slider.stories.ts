import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import Slider from './Slider.vue'

const meta = {
  title: 'Components/Slider',
  component: Slider,
  args: { min: 0, max: 100, step: 1, labels: ['Volume'] },
  render: (args) => ({
    components: { Slider },
    setup() {
      const value = ref(25)
      return { args, value }
    },
    template: '<div style="width: 20rem"><Slider v-model="value" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  play: async ({ canvasElement }) => {
    const slider = within(canvasElement).getByRole('slider', { name: 'Volume' })
    slider.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(slider).toHaveAttribute('aria-valuenow', '26')
  },
}

export const Range: Story = {
  args: { labels: ['Minimum', 'Maximum'] },
  render: (args) => ({
    components: { Slider },
    setup() {
      const value = ref([20, 80])
      return { args, value }
    },
    template: '<div style="width: 20rem"><Slider v-model="value" v-bind="args" /></div>',
  }),
}
