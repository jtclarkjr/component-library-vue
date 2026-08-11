import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { ref, type ConcreteComponent } from 'vue'

import type { ClvThemeModeInput } from '../../parts'
import type { ChoiceOption } from '../../types'
import ClvProvider from '../ClvProvider/ClvProvider.vue'
import Select from './Select.vue'

type Office = 'tokyo' | 'london' | 'new-york'

const options = [
  { value: 'tokyo', label: 'Tokyo' },
  { value: 'london', label: 'London' },
  { value: 'new-york', label: 'New York' },
] satisfies ChoiceOption<Office>[]

const neutralCorePalette = {
  dark: {
    '--clv-color-bg': 'oklch(0.145 0 0)',
    '--clv-color-surface': 'oklch(0.205 0 0)',
    '--clv-color-surface-raised': 'oklch(0.269 0 0)',
    '--clv-color-border': 'oklch(1 0 0 / 10%)',
    '--clv-color-text': 'oklch(0.985 0 0)',
    '--clv-color-text-muted': 'oklch(0.708 0 0)',
    '--clv-color-primary': 'oklch(0.922 0 0)',
    '--clv-color-on-primary': 'oklch(0.205 0 0)',
    '--clv-color-focus': 'oklch(0.556 0 0)',
  },
  light: {
    '--clv-color-bg': 'oklch(1 0 0)',
    '--clv-color-surface': 'oklch(1 0 0)',
    '--clv-color-surface-raised': 'oklch(0.97 0 0)',
    '--clv-color-border': 'oklch(0.922 0 0)',
    '--clv-color-text': 'oklch(0.145 0 0)',
    '--clv-color-text-muted': 'oklch(0.515 0 0)',
    '--clv-color-primary': 'oklch(0.205 0 0)',
    '--clv-color-on-primary': 'oklch(0.985 0 0)',
    '--clv-color-focus': 'oklch(0.708 0 0)',
  },
} as const

type NeutralPaletteMode = keyof typeof neutralCorePalette

async function expectNeutralCorePalette(style: CSSStyleDeclaration, mode: NeutralPaletteMode) {
  await Promise.all(
    Object.entries(neutralCorePalette[mode]).map(([property, value]) =>
      expect(style.getPropertyValue(property).trim()).toBe(value),
    ),
  )
}

async function expectAquaSelectGeometry(canvasElement: HTMLElement, trigger: HTMLElement) {
  const triggerIcon = canvasElement.querySelector<HTMLElement>('[data-part="icon"]')
  if (!triggerIcon) throw new Error('Expected the Select trigger icon part')
  const triggerIconStyle = canvasElement.ownerDocument.defaultView?.getComputedStyle(triggerIcon)
  if (!triggerIconStyle) throw new Error('Expected computed Select trigger icon styles')
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
}

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
    const trigger = canvas.getByRole('combobox', { name: 'Office' })
    await expectAquaSelectGeometry(canvasElement, trigger)
    await userEvent.click(trigger)
    const option = await page.findByRole('option', { name: 'London' })
    const content = option.closest('[data-clv-component="select"]')
    await expect(content).toHaveAttribute('data-part', 'content')
    await expect(content).toHaveAttribute('data-clv-theme', 'aqua')
    await userEvent.click(option)
  },
}

export const NeutralLightPortal: Story = {
  render: (args) => ({
    components: { ClvProvider, Select },
    setup() {
      const mode = ref<ClvThemeModeInput>('LIGHT')
      const value = ref<Office>()
      const toggleMode = () => {
        mode.value = mode.value === 'LIGHT' ? 'dArK' : 'LiGhT'
      }
      return { args, mode, toggleMode, value }
    },
    template: `
      <ClvProvider
        data-testid="neutral-mode-provider"
        theme="neutral"
        :mode="mode"
        style="width: 18rem; padding: 1rem; background: var(--clv-color-bg)"
      >
        <button hidden data-testid="neutral-mode-toggle" type="button" @click="toggleMode">
          Toggle mode
        </button>
        <Select v-model="value" v-bind="args" />
      </ClvProvider>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const provider = canvas.getByTestId('neutral-mode-provider')
    const modeToggle = canvas.getByTestId('neutral-mode-toggle')
    const trigger = canvas.getByRole('combobox', { name: 'Office' })
    const root = trigger.closest('[data-part="root"]')
    if (!root) throw new Error('Expected the Select root part')
    await expect(root).toHaveAttribute('data-clv-theme', 'neutral')
    await expect(root).toHaveAttribute('data-clv-theme-mode', 'light')
    await expectAquaSelectGeometry(canvasElement, trigger)
    await userEvent.click(trigger)
    const option = await page.findByRole('option', { name: 'London' })
    const content = option.closest('[data-clv-component="select"]')
    await expect(content).toHaveAttribute('data-part', 'content')
    await expect(content).toHaveAttribute('data-clv-theme', 'neutral')
    await expect(content).toHaveAttribute('data-clv-theme-mode', 'light')
    await expectNeutralCorePalette(getComputedStyle(content!), 'light')

    modeToggle.click()
    await waitFor(async () => {
      await expect(provider).toHaveAttribute('data-clv-theme-mode', 'dark')
      await expect(root).toHaveAttribute('data-clv-theme-mode', 'dark')
      await expect(content).toHaveAttribute('data-clv-theme-mode', 'dark')
      await expectNeutralCorePalette(getComputedStyle(content!), 'dark')
    })
    await expect(
      page.getByRole('option', { name: 'London' }).closest('[data-part="content"]'),
    ).toBe(content)

    modeToggle.click()
    await waitFor(async () => {
      await expect(provider).toHaveAttribute('data-clv-theme-mode', 'light')
      await expect(root).toHaveAttribute('data-clv-theme-mode', 'light')
      await expect(content).toHaveAttribute('data-clv-theme-mode', 'light')
    })
    await userEvent.click(option)
  },
}

export const ThemeBoundaries: Story = {
  render: () => ({
    components: { ClvProvider, Select },
    setup() {
      const aquaValue = ref<Office>('tokyo')
      const defaultValue = ref<Office>('tokyo')
      const nestedDefaultValue = ref<Office>('tokyo')
      const neutralDarkValue = ref<Office>('tokyo')
      const neutralLightValue = ref<Office>('tokyo')
      const unstyledValue = ref<Office>('tokyo')
      return {
        aquaValue,
        defaultValue,
        nestedDefaultValue,
        neutralDarkValue,
        neutralLightValue,
        options,
        unstyledValue,
      }
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 18rem); gap: 1rem">
        <ClvProvider
          theme="aqua"
          style="display: grid; gap: 1rem; padding: 1rem; background: var(--clv-color-bg)"
        >
          <Select id="aqua-icon-select" v-model="aquaValue" :options="options" label="Aqua office" />
          <ClvProvider theme="default" style="padding: 1rem; background: var(--clv-color-bg)">
            <Select id="default-icon-select" v-model="defaultValue" :options="options" label="Default office" />
          </ClvProvider>
          <Select id="unstyled-icon-select" v-model="unstyledValue" :options="options" aria-label="Unstyled office" unstyled />
        </ClvProvider>
        <ClvProvider
          theme="neutral"
          mode="light"
          style="display: grid; gap: 1rem; padding: 1rem; background: var(--clv-color-bg)"
        >
          <Select id="neutral-light-icon-select" v-model="neutralLightValue" :options="options" label="Neutral light office" />
          <ClvProvider
            theme="neutral"
            mode="dark"
            style="padding: 1rem; background: var(--clv-color-bg)"
          >
            <Select id="neutral-dark-icon-select" v-model="neutralDarkValue" :options="options" label="Neutral dark office" />
          </ClvProvider>
          <ClvProvider theme="default" style="padding: 1rem; background: var(--clv-color-bg)">
            <Select id="nested-default-icon-select" v-model="nestedDefaultValue" :options="options" label="Nested default office" />
          </ClvProvider>
        </ClvProvider>
      </div>
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
    const neutralLightIcon = getIcon('neutral-light-icon-select')
    const neutralDarkIcon = getIcon('neutral-dark-icon-select')
    const nestedDefaultIcon = getIcon('nested-default-icon-select')
    const unstyledIcon = getIcon('unstyled-icon-select')
    const aquaStyle = view.getComputedStyle(aquaIcon)
    const defaultStyle = view.getComputedStyle(defaultIcon)
    const neutralLightStyle = view.getComputedStyle(neutralLightIcon)
    const neutralDarkStyle = view.getComputedStyle(neutralDarkIcon)
    const nestedDefaultStyle = view.getComputedStyle(nestedDefaultIcon)
    const unstyledStyle = view.getComputedStyle(unstyledIcon)
    await expect(aquaStyle.fontSize).toBe('0px')
    await expect(aquaStyle.borderRightWidth).not.toBe('0px')
    await expect(defaultStyle.fontSize).not.toBe('0px')
    await expect(defaultStyle.borderRightWidth).toBe('0px')
    await expect(defaultStyle.transform).toBe('none')
    await expect(neutralLightIcon.closest('[data-part="root"]')).toHaveAttribute(
      'data-clv-theme-mode',
      'light',
    )
    await expectNeutralCorePalette(neutralLightStyle, 'light')
    await expect(neutralLightStyle.getPropertyValue('--clv-select-icon-stroke-width').trim()).toBe(
      '1.5px',
    )
    await expect(neutralLightStyle.fontSize).toBe('0px')
    await expect(neutralLightStyle.borderRightWidth).not.toBe('0px')
    await expect(neutralDarkIcon.closest('[data-part="root"]')).toHaveAttribute(
      'data-clv-theme-mode',
      'dark',
    )
    await expectNeutralCorePalette(neutralDarkStyle, 'dark')
    await expect(neutralDarkStyle.getPropertyValue('--clv-select-icon-stroke-width').trim()).toBe(
      '1.5px',
    )
    await expect(neutralDarkStyle.fontSize).toBe('0px')
    await expect(neutralDarkStyle.borderRightWidth).not.toBe('0px')
    await expect(nestedDefaultIcon.closest('[data-part="root"]')).toHaveAttribute(
      'data-clv-theme',
      'default',
    )
    await expect(nestedDefaultStyle.getPropertyValue('--clv-color-bg').trim()).toBe('#09111f')
    await expect(nestedDefaultStyle.getPropertyValue('--clv-color-text').trim()).toBe('#f4f7fb')
    await expect(nestedDefaultStyle.getPropertyValue('--clv-select-icon-stroke-width').trim()).toBe(
      '0',
    )
    await expect(nestedDefaultStyle.fontSize).not.toBe('0px')
    await expect(nestedDefaultStyle.borderRightWidth).toBe('0px')
    await expect(nestedDefaultStyle.transform).toBe('none')
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

export const VisualPlaceholder: Story = {
  ...Default,
  tags: ['visual', '!autodocs'],
  play: undefined,
}

export const VisualOpen: Story = {
  ...Default,
  tags: ['visual', '!autodocs'],
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'aria-hidden-focus', enabled: false }],
      },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('combobox', { name: 'Office' }))
  },
}

export const VisualInvalid: Story = {
  ...Invalid,
  tags: ['visual', '!autodocs'],
  play: undefined,
}
