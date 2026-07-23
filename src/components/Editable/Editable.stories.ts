import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import Editable from './Editable.vue'

const meta = {
  title: 'Components/Editable',
  component: Editable,
  tags: ['autodocs'],
  args: { label: 'Display name', help: 'Double-click the value to edit it.' },
  render: (args) => ({
    components: { Editable },
    setup() {
      const value = ref('Ada Lovelace')
      return { args, value }
    },
    template: '<div style="width:24rem"><Editable v-model="value" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof Editable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { startWithEditMode: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Display name' })
    await userEvent.clear(input)
    await userEvent.type(input, 'Grace Hopper')
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }))
    await expect(canvas.getByText('Grace Hopper')).toBeVisible()
  },
}
export const Readonly: Story = { args: { readonly: true } }
export const Invalid: Story = { args: { help: undefined, error: 'A display name is required.' } }
