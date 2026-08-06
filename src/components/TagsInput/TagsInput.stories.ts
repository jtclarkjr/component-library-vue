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

export const GlyphSlots: Story = {
  render: (args) => ({
    components: { TagsInput },
    setup() {
      const value = ref(['Vue', 'TypeScript'])
      return { args, value }
    },
    template: `
      <TagsInput v-model="value" v-bind="args">
        <template #delete-icon="{ tag, index, context }">
          <span data-testid="delete-icon" :data-tag="tag" :data-index="index" :data-part-name="context.part">remove</span>
        </template>
        <template #clear-icon="{ values, context }">
          <span data-testid="clear-icon" :data-count="values.length" :data-part-name="context.part">clear all</span>
        </template>
      </TagsInput>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const deleteIcon = canvas.getAllByTestId('delete-icon')[0]
    await expect(deleteIcon).toHaveAttribute('data-tag', 'Vue')
    await expect(deleteIcon).toHaveAttribute('data-index', '0')
    await expect(deleteIcon).toHaveAttribute('data-part-name', 'delete')
    const clearIcon = canvas.getByTestId('clear-icon')
    await expect(clearIcon).toHaveAttribute('data-count', '2')
    await expect(clearIcon).toHaveAttribute('data-part-name', 'clear')
  },
}
