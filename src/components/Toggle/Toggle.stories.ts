import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import Toggle from './Toggle.vue'

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  args: { variant: 'outline', size: 'md' },
  render: (args) => ({
    components: { Toggle },
    setup() {
      const pressed = ref(false)
      return { args, pressed }
    },
    template: '<Toggle v-model="pressed" v-bind="args">Bold</Toggle>',
  }),
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Bold' })
    await userEvent.click(button)
    await expect(button).toHaveAttribute('data-state', 'on')
  },
}

export const Disabled: Story = { args: { disabled: true } }
