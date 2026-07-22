import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import { ref } from 'vue'

import Button from '../Button/Button.vue'
import Tooltip from './Tooltip.vue'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: { content: 'Copy project URL', delayDuration: 0 },
  render: (args) => ({
    components: { Button, Tooltip },
    setup() {
      const open = ref(true)
      return { args, open }
    },
    template: `<Tooltip v-model:open="open" v-bind="args">
      <Button aria-label="Copy link" size="sm" variant="secondary">Copy</Button>
    </Tooltip>`,
  }),
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Copy link' })
    await expect(trigger).toBeVisible()
    await expect(trigger).toHaveAccessibleDescription('Copy project URL')
    await expect(canvas.getByText('Copy project URL', { selector: '.clv-tooltip' })).toBeVisible()
  },
}

export const Disabled: Story = { args: { disabled: true } }
