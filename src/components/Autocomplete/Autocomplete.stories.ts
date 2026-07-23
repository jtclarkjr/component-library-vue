import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import Autocomplete from './Autocomplete.vue'

const suggestions = [
  { value: 'tokyo', label: 'Tokyo', description: 'Japan', keywords: ['JP'] },
  { value: 'london', label: 'London', description: 'United Kingdom' },
  { value: 'new-york', label: 'New York', description: 'United States' },
]

const meta = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  args: { suggestions, label: 'Destination', help: 'Type a city or enter your own.' },
  render: (args) => ({
    components: { Autocomplete },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<div style="width:20rem"><Autocomplete v-model="value" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof Autocomplete>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const input = canvas.getByRole('combobox', { name: 'Destination' })
    await userEvent.type(input, 'lon')
    await userEvent.click(await page.findByRole('option', { name: /London/ }))
    await expect(input).toHaveValue('London')
  },
}

export const Empty: Story = { args: { suggestions: [], emptyText: 'No destinations yet.' } }
export const Virtualized: Story = {
  args: {
    virtualize: true,
    suggestions: Array.from({ length: 200 }, (_, index) => ({
      value: index,
      label: `Destination ${index + 1}`,
    })),
  },
}
export const Invalid: Story = { args: { help: undefined, error: 'Choose a destination.' } }
