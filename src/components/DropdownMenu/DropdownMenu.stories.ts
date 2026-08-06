import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import Button from '../Button/Button.vue'
import DropdownMenu from './DropdownMenu.vue'
import type { DropdownMenuEntry } from '../../types'

const items: DropdownMenuEntry[] = [
  { value: 'edit', label: 'Edit project' },
  { value: 'duplicate', label: 'Duplicate' },
  { type: 'separator' as const, value: 'divider' },
  { value: 'delete', label: 'Delete', destructive: true },
]

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  args: { items, onSelect: fn() },
  render: (args) => ({
    components: { Button, DropdownMenu },
    setup: () => ({ args }),
    template: `<DropdownMenu v-bind="args">
      <template #trigger><Button variant="secondary">Project actions</Button></template>
    </DropdownMenu>`,
  }),
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole('button', { name: 'Project actions' })
    await userEvent.click(trigger)
    await userEvent.click(await page.findByRole('menuitem', { name: 'Edit project' }))
    await expect(args.onSelect).toHaveBeenCalledOnce()
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const Advanced: Story = {
  args: {
    items: [
      { type: 'label', value: 'view-label', label: 'View' },
      { type: 'checkbox', value: 'sidebar', label: 'Show sidebar', checked: true },
      {
        type: 'radio-group',
        value: 'density',
        label: 'Density',
        selectedValue: 'comfortable',
        options: [
          { value: 'compact', label: 'Compact' },
          { value: 'comfortable', label: 'Comfortable' },
        ],
      },
      {
        type: 'submenu',
        value: 'share',
        label: 'Share',
        items: [
          { value: 'copy-link', label: 'Copy link' },
          { value: 'email', label: 'Email' },
        ],
      },
      { type: 'separator', value: 'danger-divider' },
      { value: 'delete', label: 'Delete project', destructive: true },
    ],
  },
}

export const RecursiveGlyphSlots: Story = {
  args: {
    items: [
      { type: 'checkbox', value: 'top-choice', label: 'Top choice', checked: true },
      {
        type: 'group',
        value: 'nested-group',
        label: 'Nested',
        items: [
          { type: 'checkbox', value: 'nested-choice', label: 'Nested choice', checked: true },
        ],
      },
      {
        type: 'submenu',
        value: 'more',
        label: 'More choices',
        items: [{ value: 'future-choice', label: 'Future choice' }],
      },
    ],
  },
  render: (args) => ({
    components: { Button, DropdownMenu },
    setup: () => ({ args }),
    template: `
      <DropdownMenu v-bind="args">
        <template #trigger><Button variant="secondary">Glyph actions</Button></template>
        <template #submenu-indicator="{ depth, context }">
          <span data-testid="submenu-indicator" :data-depth="depth" :data-part-name="context.part">next</span>
        </template>
        <template #indicator="{ entry, depth, checked, context }">
          <span data-testid="menu-indicator" :data-entry="entry.value" :data-depth="depth" :data-checked="checked" :data-part-name="context.part">chosen</span>
        </template>
      </DropdownMenu>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Glyph actions' }))
    const initialIndicators = await page.findAllByTestId('menu-indicator')
    const topIndicator = initialIndicators.find(
      (indicator) => indicator.dataset.entry === 'top-choice',
    )
    await expect(topIndicator).toHaveAttribute('data-entry', 'top-choice')
    await expect(topIndicator).toHaveAttribute('data-depth', '0')
    await expect(topIndicator).toHaveAttribute('data-checked', 'true')
    await expect(topIndicator).toHaveAttribute('data-part-name', 'indicator')
    const submenuIndicator = page.getByTestId('submenu-indicator')
    await expect(submenuIndicator).toHaveAttribute('data-part-name', 'submenuTrigger')
    const indicators = await page.findAllByTestId('menu-indicator')
    const nestedIndicator = indicators.find(
      (indicator) => indicator.dataset.entry === 'nested-choice',
    )
    await expect(nestedIndicator).toHaveAttribute('data-depth', '1')
    await expect(nestedIndicator).toHaveAttribute('data-part-name', 'indicator')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Glyph actions' })).toHaveFocus())
  },
}
