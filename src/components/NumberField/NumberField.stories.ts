import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import NumberField from './NumberField.vue'

const meta = {
  title: 'Components/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  args: { label: 'Seats', help: 'Between one and ten.', min: 1, max: 10, step: 1 },
  render: (args) => ({
    components: { NumberField },
    setup() {
      const value = ref<number | null>(2)
      return { args, value }
    },
    template: '<div style="width:16rem"><NumberField v-model="value" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof NumberField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Increase value' }))
    await expect(canvas.getByRole('spinbutton', { name: 'Seats' })).toHaveValue('3')
  },
}
export const Currency: Story = {
  args: {
    label: 'Budget',
    min: 0,
    max: 10000,
    step: 50,
    formatOptions: { style: 'currency', currency: 'USD' },
  },
}
export const Invalid: Story = { args: { help: undefined, error: 'Enter a supported value.' } }
