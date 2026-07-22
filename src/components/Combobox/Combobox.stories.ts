import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import Combobox from './Combobox.vue'

const options = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'rust', label: 'Rust' },
]

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  args: { options, label: 'Language', help: 'Search or select a language.' },
  render: (args) => ({
    components: { Combobox },
    setup() {
      const value = ref<string>()
      const search = ref('')
      return { args, search, value }
    },
    template:
      '<div style="width: 20rem"><Combobox v-model="value" v-model:search-term="search" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const input = canvas.getByRole('combobox', { name: 'Language' })
    await userEvent.type(input, 'java')
    await userEvent.click(await page.findByRole('option', { name: 'JavaScript' }))
    await expect(input).toHaveValue('JavaScript')
    await userEvent.tab()
  },
}

export const Empty: Story = { args: { options: [], emptyText: 'Nothing found' } }
