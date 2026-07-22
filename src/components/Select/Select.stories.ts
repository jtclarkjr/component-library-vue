import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import Select from './Select.vue'

const options = [
  { value: 'tokyo', label: 'Tokyo' },
  { value: 'london', label: 'London' },
  { value: 'new-york', label: 'New York' },
]

const meta = {
  title: 'Components/Select',
  component: Select,
  args: { options, label: 'Office', help: 'Used for local time and holidays.' },
  render: (args) => ({
    components: { Select },
    setup() {
      const value = ref<string>()
      return { args, value }
    },
    template: '<div style="width: 18rem"><Select v-model="value" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('combobox', { name: 'Office' }))
    await userEvent.click(await page.findByRole('option', { name: 'London' }))
    await expect(canvas.getByRole('combobox', { name: 'Office' })).toHaveTextContent('London')
  },
}

export const Invalid: Story = { args: { help: undefined, error: 'Choose an office.' } }
