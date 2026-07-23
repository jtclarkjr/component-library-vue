import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import Rating from './Rating.vue'

const meta = {
  title: 'Components/Rating',
  component: Rating,
  tags: ['autodocs'],
  args: { label: 'Experience', help: 'Rate from one to five stars.', clearable: true },
  render: (args) => ({
    components: { Rating },
    setup() {
      const value = ref(2)
      return { args, value }
    },
    template: '<Rating v-model="value" v-bind="args" />',
  }),
} satisfies Meta<typeof Rating>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('radio', { name: '4 stars' }))
    await expect(canvas.getByText('4 / 5')).toBeVisible()
  },
}
export const Granular: Story = { args: { step: 0.5 } }
export const Readonly: Story = { args: { readonly: true } }
