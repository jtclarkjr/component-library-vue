import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import Pagination from './Pagination.vue'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  args: { total: 120, itemsPerPage: 10, showEdges: true, ariaLabel: 'Search results pages' },
  render: (args) => ({
    components: { Pagination },
    setup() {
      const page = ref(1)
      return { args, page }
    },
    template: '<Pagination v-model:page="page" v-bind="args" />',
  }),
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }))
    await expect(canvas.getByRole('button', { name: 'Page 2' })).toHaveAttribute('data-selected')
  },
}

export const Disabled: Story = { args: { disabled: true } }
