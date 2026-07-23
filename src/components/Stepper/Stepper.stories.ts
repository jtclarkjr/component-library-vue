import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import Stepper from './Stepper.vue'

const steps = [
  { value: 1, title: 'Account', description: 'Contact details' },
  { value: 2, title: 'Profile', description: 'Personalize your account' },
  { value: 3, title: 'Review', description: 'Confirm and submit' },
]

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: { steps },
  render: (args) => ({
    components: { Stepper },
    setup() {
      const value = ref(1)
      return { args, value }
    },
    template:
      '<Stepper v-model="value" v-bind="args"><template #panel="{ step }"><h3>{{ step?.title }}</h3><p>Complete the {{ step?.title.toLowerCase() }} step.</p></template></Stepper>',
  }),
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }))
    await expect(canvas.getByRole('heading', { name: 'Profile', level: 3 })).toBeVisible()
  },
}
export const Vertical: Story = { args: { orientation: 'vertical' } }
export const NonLinear: Story = { args: { linear: false } }
