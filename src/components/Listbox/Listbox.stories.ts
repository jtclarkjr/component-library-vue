import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import Listbox from './Listbox.vue'

const options = [
  { value: 'design', label: 'Design', description: 'Product and brand design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'legal', label: 'Legal', disabled: true },
]

const meta = {
  title: 'Components/Listbox',
  component: Listbox,
  tags: ['autodocs'],
  args: { options, label: 'Team', help: 'Use the arrow keys to browse.' },
  render: (args) => ({
    components: { Listbox },
    setup() {
      const value = ref<string | number | Array<string | number>>()
      return { args, value }
    },
    template: '<div style="width:20rem"><Listbox v-model="value" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof Listbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const option = canvas.getByRole('option', { name: /Engineering/ })
    await userEvent.click(option)
    await expect(option).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('option', { name: 'Legal' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
  },
}
export const Multiple: Story = { args: { multiple: true } }
export const Empty: Story = { args: { options: [] } }
export const Virtualized: Story = {
  args: {
    virtualize: true,
    options: Array.from({ length: 300 }, (_, index) => ({
      value: index,
      label: `Member ${index + 1}`,
    })),
  },
}
