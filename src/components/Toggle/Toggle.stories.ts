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
    template: `
      <Toggle v-model="pressed" v-bind="args">
        <template #default="{ context }">
          <span
            data-testid="toggle-slot-context"
            :data-slot-part="context.part"
            :data-slot-pressed="String(context.pressed)"
            :data-slot-unstyled="String(context.unstyled)"
          >Bold</span>
        </template>
      </Toggle>
    `,
  }),
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Bold' })
    const context = within(canvasElement).getByTestId('toggle-slot-context')
    await expect(context).toHaveAttribute('data-slot-part', 'root')
    await expect(context).toHaveAttribute('data-slot-pressed', 'false')
    await expect(context).toHaveAttribute('data-slot-unstyled', 'false')
    await userEvent.click(button)
    await expect(button).toHaveAttribute('data-state', 'on')
    await expect(context).toHaveAttribute('data-slot-pressed', 'true')
  },
}

export const Disabled: Story = { args: { disabled: true } }
