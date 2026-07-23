import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Time } from '@internationalized/date'
import { ref } from 'vue'

import TimeRangeField from './TimeRangeField.vue'

const meta = {
  title: 'Components/TimeRangeField',
  component: TimeRangeField,
  tags: ['autodocs'],
  args: { label: 'Office hours', hourCycle: 12 },
  render: (args) => ({
    components: { TimeRangeField },
    setup() {
      const value = ref({ start: new Time(9), end: new Time(17, 30) })
      return { args, value }
    },
    template: '<div style="width:30rem"><TimeRangeField v-model="value" v-bind="args" /></div>',
  }),
} satisfies Meta<typeof TimeRangeField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithSeconds: Story = { args: { granularity: 'second', step: { second: 15 } } }
