import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import Switch from './Switch.vue'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { label: 'Automatic updates', help: 'Install updates when the app closes.', size: 'md' },
  render: (args) => ({
    components: { Switch },
    setup() {
      const checked = ref(false)
      return { args, checked }
    },
    template: '<Switch v-model="checked" v-bind="args" />',
  }),
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole('switch', { name: 'Automatic updates' })
    await userEvent.click(control)
    await expect(control).toBeChecked()
    await expect(control).toHaveAccessibleDescription('Install updates when the app closes.')
  },
}

export const Large: Story = { args: { size: 'lg' } }
export const Disabled: Story = { args: { disabled: true } }
