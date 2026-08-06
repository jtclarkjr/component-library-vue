import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref, type ConcreteComponent } from 'vue'

import type { ChoiceOption } from '../../types'
import ClvProvider from '../ClvProvider/ClvProvider.vue'
import Select from './Select.vue'

type Office = 'tokyo' | 'london' | 'new-york'

const options = [
  { value: 'tokyo', label: 'Tokyo' },
  { value: 'london', label: 'London' },
  { value: 'new-york', label: 'New York' },
] satisfies ChoiceOption<Office>[]

const meta = {
  title: 'Components/Select',
  // Storybook's component constraint cannot currently instantiate a Vue generic SFC.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  component: Select as unknown as ConcreteComponent,
  args: { options, label: 'Office', help: 'Used for local time and holidays.' },
  render: (args) => ({
    components: { Select },
    setup() {
      const value = ref<string>()
      return { args, value }
    },
    template: '<div style="width: 18rem"><Select v-model="value" v-bind="args" /></div>',
  }),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('combobox', { name: 'Office' }))
    await userEvent.click(await page.findByRole('option', { name: 'London' }))
    await expect(canvas.getByRole('combobox', { name: 'Office' })).toHaveTextContent('London')
  },
}

export const Invalid: Story = { args: { help: undefined, error: 'Choose an office.' } }

export const AquaPortal: Story = {
  render: (args) => ({
    components: { ClvProvider, Select },
    setup() {
      const value = ref<Office>()
      return { args, value }
    },
    template: `
      <ClvProvider theme="aqua" style="width: 18rem">
        <Select v-model="value" v-bind="args" />
      </ClvProvider>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const triggerIcon = canvasElement.querySelector<HTMLElement>('[data-part="icon"]')
    if (!triggerIcon) throw new Error('Expected the Select trigger icon part')
    const triggerIconStyle = canvasElement.ownerDocument.defaultView?.getComputedStyle(triggerIcon)
    if (!triggerIconStyle) throw new Error('Expected computed Select trigger icon styles')
    const trigger = canvas.getByRole('combobox', { name: 'Office' })
    await expect(triggerIcon).toHaveClass('clv-select__icon--default')
    await expect(Number.parseFloat(triggerIconStyle.width)).toBeCloseTo(7.2, 1)
    await expect(Number.parseFloat(triggerIconStyle.height)).toBeCloseTo(7.2, 1)
    await expect(triggerIconStyle.getPropertyValue('--clv-select-icon-stroke-width').trim()).toBe(
      '1.5px',
    )
    await expect(triggerIconStyle.borderRightWidth).not.toBe('0px')
    await expect(triggerIconStyle.borderBottomWidth).not.toBe('0px')
    await expect(triggerIconStyle.fontSize).toBe('0px')
    await expect(triggerIconStyle.lineHeight).toBe('0px')
    await expect(triggerIconStyle.transform).not.toBe('none')
    const triggerBounds = trigger.getBoundingClientRect()
    const iconBounds = triggerIcon.getBoundingClientRect()
    const verticalOffset = Math.abs(
      triggerBounds.top + triggerBounds.height / 2 - (iconBounds.top + iconBounds.height / 2),
    )
    await expect(verticalOffset).toBeLessThanOrEqual(2)
    await userEvent.click(trigger)
    const option = await page.findByRole('option', { name: 'London' })
    const content = option.closest('[data-clv-component="select"]')
    await expect(content).toHaveAttribute('data-part', 'content')
    await expect(content).toHaveAttribute('data-clv-theme', 'aqua')
    await userEvent.click(option)
  },
}

export const ThemeBoundaries: Story = {
  render: () => ({
    components: { ClvProvider, Select },
    setup() {
      const aquaValue = ref<Office>('tokyo')
      const defaultValue = ref<Office>('tokyo')
      const unstyledValue = ref<Office>('tokyo')
      return { aquaValue, defaultValue, options, unstyledValue }
    },
    template: `
      <ClvProvider theme="aqua" style="display: grid; width: 18rem; gap: 1rem">
        <Select id="aqua-icon-select" v-model="aquaValue" :options="options" label="Aqua office" />
        <ClvProvider theme="default">
          <Select id="default-icon-select" v-model="defaultValue" :options="options" label="Default office" />
        </ClvProvider>
        <Select id="unstyled-icon-select" v-model="unstyledValue" :options="options" aria-label="Unstyled office" unstyled />
      </ClvProvider>
    `,
  }),
  play: async ({ canvasElement }) => {
    const getIcon = (controlId: string) => {
      const icon = canvasElement.querySelector<HTMLElement>(`#${controlId} [data-part="icon"]`)
      if (!icon) throw new Error(`Expected an icon for ${controlId}`)
      return icon
    }
    const view = canvasElement.ownerDocument.defaultView
    if (!view) throw new Error('Expected a document view')
    const aquaIcon = getIcon('aqua-icon-select')
    const defaultIcon = getIcon('default-icon-select')
    const unstyledIcon = getIcon('unstyled-icon-select')
    const aquaStyle = view.getComputedStyle(aquaIcon)
    const defaultStyle = view.getComputedStyle(defaultIcon)
    const unstyledStyle = view.getComputedStyle(unstyledIcon)
    await expect(aquaStyle.fontSize).toBe('0px')
    await expect(aquaStyle.borderRightWidth).not.toBe('0px')
    await expect(defaultStyle.fontSize).not.toBe('0px')
    await expect(defaultStyle.borderRightWidth).toBe('0px')
    await expect(defaultStyle.transform).toBe('none')
    await expect(unstyledIcon).not.toHaveClass('clv-select__icon--default')
    await expect(unstyledStyle.fontSize).not.toBe('0px')
    await expect(unstyledStyle.borderRightWidth).toBe('0px')
    await expect(unstyledStyle.transform).toBe('none')
  },
}

export const GlyphSlots: Story = {
  render: (args) => ({
    components: { ClvProvider, Select },
    setup() {
      const value = ref<Office>('tokyo')
      return { args, value }
    },
    template: `
      <ClvProvider theme="aqua" style="width: 18rem">
        <Select v-model="value" v-bind="args">
          <template #trigger-icon="{ value: selectedValue, context }">
            <span data-testid="select-trigger-icon" style="color: var(--clv-color-text)" :data-value="selectedValue" :data-part-name="context.part">open</span>
          </template>
          <template #indicator="{ selected, context }">
            <span data-testid="select-indicator" :data-selected="selected" :data-part-name="context.part">chosen</span>
          </template>
        </Select>
      </ClvProvider>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const triggerIcon = canvas.getByTestId('select-trigger-icon')
    const triggerIconPart = triggerIcon.closest('[data-part="icon"]')
    if (!triggerIconPart) throw new Error('Expected the Select trigger icon part')
    await expect(triggerIcon).toHaveAttribute('data-value', 'tokyo')
    await expect(triggerIcon).toHaveAttribute('data-part-name', 'icon')
    await expect(triggerIconPart).not.toHaveClass('clv-select__icon--default')
    const triggerIconStyle =
      canvasElement.ownerDocument.defaultView?.getComputedStyle(triggerIconPart)
    if (!triggerIconStyle) throw new Error('Expected computed custom trigger icon styles')
    await expect(triggerIconStyle.fontSize).not.toBe('0px')
    await expect(triggerIconStyle.borderRightWidth).toBe('0px')
    await expect(triggerIconStyle.transform).toBe('none')
    await userEvent.click(canvas.getByRole('combobox', { name: 'Office' }))
    const indicator = await page.findByTestId('select-indicator')
    await expect(indicator).toHaveAttribute('data-selected', 'true')
    await expect(indicator).toHaveAttribute('data-part-name', 'indicator')
    await userEvent.click(page.getByRole('option', { name: 'Tokyo' }))
  },
}
