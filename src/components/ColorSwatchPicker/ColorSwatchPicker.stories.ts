import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import type { ColorSwatchOption } from '../../types'
import ColorSwatchPicker from './ColorSwatchPicker.vue'

const options: ColorSwatchOption[] = [
  { value: 'mint', color: '#74e0c1', label: 'Mint' },
  { value: 'ocean', color: '#2f80ed', label: 'Ocean blue' },
  { value: 'coral', color: '#ff4d6d80', label: 'Transparent coral' },
  { value: 'disabled', color: '#7f8c8d', label: 'Disabled gray', disabled: true },
]

const meta = {
  title: 'Components/ColorSwatchPicker',
  component: ColorSwatchPicker,
  tags: ['autodocs'],
  args: { options, label: 'Theme color' },
  render: (args) => ({
    components: { ColorSwatchPicker },
    setup() {
      const value = ref<string | number>('mint')
      return { args, value }
    },
    template:
      '<div><ColorSwatchPicker v-model="value" v-bind="args" /><output aria-label="Selected color">{{ value }}</output></div>',
  }),
} satisfies Meta<typeof ColorSwatchPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const colorOptions = canvas.getAllByRole('option')
    await userEvent.click(colorOptions[1]!)
    await expect(canvas.getByRole('status', { name: 'Selected color' })).toHaveTextContent('ocean')
  },
}
export const Multiple: Story = {
  args: { multiple: true, label: 'Accent colors' },
  render: (args) => ({
    components: { ColorSwatchPicker },
    setup() {
      const value = ref<(string | number)[]>(['mint', 'coral'])
      return { args, value }
    },
    template: '<ColorSwatchPicker v-model="value" v-bind="args" />',
  }),
}
export const Vertical: Story = { args: { orientation: 'vertical' } }
export const Empty: Story = { args: { options: [], label: 'No colors available' } }
