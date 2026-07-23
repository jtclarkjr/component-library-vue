import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import ColorField from './ColorField.vue'

const meta = {
  title: 'Components/ColorField',
  component: ColorField,
  tags: ['autodocs'],
  args: { label: 'Brand color', help: 'Enter a CSS hexadecimal color.' },
  render: (args) => ({
    components: { ColorField },
    setup() {
      const value = ref('#2f80ed')
      return { args, value }
    },
    template: '<div style="width:20rem"><ColorField v-model="value" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof ColorField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Brand color' })
    await userEvent.clear(input)
    await userEvent.type(input, '#ff0000')
    await userEvent.tab()
    await expect(input).toHaveValue('#ff0000')
  },
}
export const RedChannel: Story = {
  args: { label: 'Red channel', channel: 'red', colorSpace: 'rgb', step: 5 },
}
export const Invalid: Story = { args: { error: 'Enter a valid CSS color.' } }
export const Readonly: Story = { args: { readonly: true } }
