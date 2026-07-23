import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import CheckboxGroup from './CheckboxGroup.vue'

const options = [
  { value: 'email', label: 'Email', description: 'Weekly product updates' },
  { value: 'push', label: 'Push notifications' },
  { value: 'sms', label: 'SMS', disabled: true },
]

const meta = {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  args: { options, label: 'Notification channels', help: 'Choose any that apply.' },
  render: (args) => ({
    components: { CheckboxGroup },
    setup() {
      const value = ref<Array<string | number>>([])
      return { args, value }
    },
    template: '<CheckboxGroup v-model="value" v-bind="args" />',
  }),
} satisfies Meta<typeof CheckboxGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const email = canvas.getByRole('checkbox', { name: /Email/ })
    await userEvent.click(email)
    await expect(email).toBeChecked()
    await expect(canvas.getByRole('checkbox', { name: 'SMS' })).toBeDisabled()
  },
}
export const Horizontal: Story = { args: { orientation: 'horizontal' } }
export const Invalid: Story = { args: { help: undefined, error: 'Select at least one channel.' } }
