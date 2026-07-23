import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import ToggleGroup from './ToggleGroup.vue'

const options = [
  { value: 'left', label: 'Align left' },
  { value: 'center', label: 'Align center' },
  { value: 'right', label: 'Align right' },
]

const meta = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  args: { options, label: 'Text alignment' },
  render: (args) => ({
    components: { ToggleGroup },
    setup() {
      const value = ref<string | number | Array<string | number>>('left')
      return { args, value }
    },
    template: '<ToggleGroup v-model="value" v-bind="args" />',
  }),
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const center = canvas.getByRole('button', { name: 'Align center' })
    await userEvent.click(center)
    await expect(center).toHaveAttribute('data-state', 'on')
  },
}
export const Multiple: Story = { args: { type: 'multiple' } }
export const VerticalOutline: Story = { args: { orientation: 'vertical', variant: 'outline' } }
