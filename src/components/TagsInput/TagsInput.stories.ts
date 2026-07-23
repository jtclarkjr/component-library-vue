import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import TagsInput from './TagsInput.vue'

const meta = {
  title: 'Components/TagsInput',
  component: TagsInput,
  tags: ['autodocs'],
  args: { label: 'Skills', help: 'Press Enter, Tab, or comma to add a tag.', max: 6 },
  render: (args) => ({
    components: { TagsInput },
    setup() {
      const value = ref(['Vue', 'TypeScript'])
      return { args, value }
    },
    template: '<div style="width:28rem"><TagsInput v-model="value" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof TagsInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Skills' })
    await userEvent.type(input, 'Reka{Enter}')
    await expect(canvas.getByText('Reka')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Reka' }))
    await expect(canvas.queryByText('Reka')).not.toBeInTheDocument()
  },
}
export const Empty: Story = {
  render: (args) => ({
    components: { TagsInput },
    setup() {
      const value = ref<string[]>([])
      return { args, value }
    },
    template: '<TagsInput v-model="value" v-bind="args" />',
  }),
}
export const Invalid: Story = { args: { help: undefined, error: 'Add at least one skill.' } }
