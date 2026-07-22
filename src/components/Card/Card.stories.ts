import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Card from './Card.vue'

const meta = {
  title: 'Components/Card',
  component: Card,
  args: {
    title: 'Design system status',
    variant: 'default',
  },
  render: (args) => ({
    components: { Card },
    setup: () => ({ args }),
    template: `<Card v-bind="args">
      <p>Themeable primitives with accessible behavior and local package workflows.</p>
      <template #footer>Updated just now</template>
    </Card>`,
  }),
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Accent: Story = {
  args: { variant: 'accent' },
}

export const Subtle: Story = {
  args: { variant: 'subtle' },
}
