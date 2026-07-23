import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import type { ClvValue, TreeNode } from '../../types'
import Tree from './Tree.vue'

const items: TreeNode[] = [
  {
    value: 'src',
    label: 'src',
    children: [
      {
        value: 'components',
        label: 'components',
        children: [{ value: 'button', label: 'Button.vue' }],
      },
      { value: 'index', label: 'index.ts' },
    ],
  },
  { value: 'package', label: 'package.json' },
]

const meta = {
  title: 'Components/Tree',
  component: Tree,
  tags: ['autodocs'],
  args: { items, label: 'Project files' },
  render: (args) => ({
    components: { Tree },
    setup() {
      const value = ref<ClvValue>()
      const expanded = ref<ClvValue[]>([])
      return { args, value, expanded }
    },
    template:
      '<div style="width:24rem"><Tree v-model="value" v-model:expanded="expanded" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof Tree>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Expand src' }))
    const child = await canvas.findByRole('treeitem', { name: /index.ts/ })
    await userEvent.click(child)
    await expect(child).toHaveAttribute('aria-selected', 'true')
  },
}
export const Multiple: Story = {
  args: { multiple: true, propagateSelect: true, bubbleSelect: true },
}
export const Virtualized: Story = {
  args: {
    virtualize: true,
    items: Array.from({ length: 300 }, (_, index) => ({
      value: index,
      label: `Node ${index + 1}`,
    })),
  },
}
