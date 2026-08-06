import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import Checkbox from './Checkbox.vue'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { label: 'Send me product updates', help: 'No more than one email per month.' },
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const checked = ref(false)
      return { args, checked }
    },
    template: '<Checkbox v-model="checked" v-bind="args" />',
  }),
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', {
      name: 'Send me product updates',
    })
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
    await expect(checkbox).toHaveAccessibleDescription('No more than one email per month.')
  },
}

export const Indeterminate: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const checked = ref<'indeterminate'>('indeterminate')
      return { args, checked }
    },
    template: '<Checkbox v-model="checked" v-bind="args" />',
  }),
}

export const Invalid: Story = { args: { help: undefined, error: 'This agreement is required.' } }

export const IndicatorSlot: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const checked = ref(true)
      return { args, checked }
    },
    template: `
      <Checkbox v-model="checked" v-bind="args">
        <template #indicator="{ checked: state, context }">
          <span data-testid="checkbox-indicator" :data-checked="state" :data-part-name="context.part">ok</span>
        </template>
      </Checkbox>
    `,
  }),
  play: async ({ canvasElement }) => {
    const indicator = within(canvasElement).getByTestId('checkbox-indicator')
    await expect(indicator).toHaveTextContent('ok')
    await expect(indicator).toHaveAttribute('data-checked', 'true')
    await expect(indicator).toHaveAttribute('data-part-name', 'indicator')
  },
}
