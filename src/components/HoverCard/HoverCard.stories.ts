import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'

import HoverCard from './HoverCard.vue'

const meta = {
  title: 'Components/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  args: {
    openDelay: 0,
    closeDelay: 0,
    text: 'Ada Lovelace wrote the first published algorithm for a machine.',
  },
  render: (args) => ({
    components: { HoverCard },
    setup: () => ({ args }),
    template:
      '<HoverCard v-bind="args"><template #trigger><a href="#ada" style="color:var(--clv-color-primary)">@ada</a></template></HoverCard>',
  }),
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.hover(canvas.getByRole('link', { name: '@ada' }))
    await expect(await page.findByText(/first published algorithm/)).toBeVisible()
  },
}
export const RichContent: Story = {
  render: (args) => ({
    components: { HoverCard },
    setup: () => ({ args }),
    template:
      '<HoverCard v-bind="args"><template #trigger><button>Preview member</button></template><template #content><strong>Ada Lovelace</strong><p>Mathematician and computing pioneer.</p></template></HoverCard>',
  }),
}
