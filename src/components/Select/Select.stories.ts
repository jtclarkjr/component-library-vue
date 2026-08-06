import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref, type ConcreteComponent } from 'vue'

import type { ChoiceOption } from '../../types'
import ClvProvider from '../ClvProvider/ClvProvider.vue'
import Select from './Select.vue'

type Office = 'tokyo' | 'london' | 'new-york'

const options = [
  { value: 'tokyo', label: 'Tokyo' },
  { value: 'london', label: 'London' },
  { value: 'new-york', label: 'New York' },
] satisfies ChoiceOption<Office>[]

const meta = {
  title: 'Components/Select',
  // Storybook's component constraint cannot currently instantiate a Vue generic SFC.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  component: Select as unknown as ConcreteComponent,
  args: { options, label: 'Office', help: 'Used for local time and holidays.' },
  render: (args) => ({
    components: { Select },
    setup() {
      const value = ref<string>()
      return { args, value }
    },
    template: '<div style="width: 18rem"><Select v-model="value" v-bind="args" /></div>',
  }),
} satisfies Meta

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

export const AquaPortal: Story = {
  render: (args) => ({
    components: { ClvProvider, Select },
    setup() {
      const value = ref<Office>()
      return { args, value }
    },
    template: `
      <ClvProvider theme="aqua" style="width: 18rem">
        <Select v-model="value" v-bind="args" />
      </ClvProvider>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('combobox', { name: 'Office' }))
    const option = await page.findByRole('option', { name: 'London' })
    const content = option.closest('[data-clv-component="select"]')
    await expect(content).toHaveAttribute('data-part', 'content')
    await expect(content).toHaveAttribute('data-clv-theme', 'aqua')
    await userEvent.click(option)
  },
}

export const GlyphSlots: Story = {
  render: (args) => ({
    components: { Select },
    setup() {
      const value = ref<Office>('tokyo')
      return { args, value }
    },
    template: `
      <div style="width: 18rem">
        <Select v-model="value" v-bind="args">
          <template #trigger-icon="{ value: selectedValue, context }">
            <span data-testid="select-trigger-icon" :data-value="selectedValue" :data-part-name="context.part">open</span>
          </template>
          <template #indicator="{ selected, context }">
            <span data-testid="select-indicator" :data-selected="selected" :data-part-name="context.part">chosen</span>
          </template>
        </Select>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const triggerIcon = canvas.getByTestId('select-trigger-icon')
    await expect(triggerIcon).toHaveAttribute('data-value', 'tokyo')
    await expect(triggerIcon).toHaveAttribute('data-part-name', 'icon')
    await userEvent.click(canvas.getByRole('combobox', { name: 'Office' }))
    const indicator = await page.findByTestId('select-indicator')
    await expect(indicator).toHaveAttribute('data-selected', 'true')
    await expect(indicator).toHaveAttribute('data-part-name', 'indicator')
    await userEvent.click(page.getByRole('option', { name: 'Tokyo' }))
  },
}
