import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CalendarDate } from '@internationalized/date'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { ref } from 'vue'

import type { ButtonParts, InputParts } from '../../parts'
import type { MenubarMenu, NavigationMenuItem } from '../../types'
import Button from '../Button/Button.vue'
import Calendar from '../Calendar/Calendar.vue'
import DateField from '../DateField/DateField.vue'
import DatePicker from '../DatePicker/DatePicker.vue'
import DateRangeField from '../DateRangeField/DateRangeField.vue'
import DateRangePicker from '../DateRangePicker/DateRangePicker.vue'
import Input from '../Input/Input.vue'
import Menubar from '../Menubar/Menubar.vue'
import NavigationMenu from '../NavigationMenu/NavigationMenu.vue'
import ClvProvider from './ClvProvider.vue'

const meta = {
  title: 'Foundation/ClvProvider',
  component: ClvProvider,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ClvProvider>

export default meta
type Story = StoryObj<typeof meta>

export const ThemeAndPartsContract: Story = {
  render: () => ({
    components: { Button, ClvProvider, Input },
    setup() {
      const theme = ref<'default' | 'aqua'>('default')
      const providerUnstyled = ref(false)
      const value = ref('Search')
      const toggleTheme = () => {
        theme.value = theme.value === 'default' ? 'aqua' : 'default'
      }
      const toggleProviderStyles = () => {
        providerUnstyled.value = !providerUnstyled.value
      }
      const buttonParts: ButtonParts = {
        root: ({ theme: currentTheme, unstyled }) => ({
          'data-resolved-theme': currentTheme,
          'data-resolved-unstyled': String(unstyled),
        }),
      }
      const inputParts: InputParts = {
        control: { 'data-testid': 'input-control' },
        input: { 'data-testid': 'native-input', autocomplete: 'off' },
      }
      return {
        buttonParts,
        inputParts,
        providerUnstyled,
        theme,
        toggleProviderStyles,
        toggleTheme,
        value,
      }
    },
    template: `
      <ClvProvider
        data-testid="provider"
        :theme="theme"
        :unstyled="providerUnstyled"
      >
        <button type="button" @click="toggleTheme">Toggle theme</button>
        <button type="button" @click="toggleProviderStyles">Toggle provider styles</button>
        <Button :parts="buttonParts">
          <template #default="{ context }">
            <span
              data-testid="button-slot-context"
              :data-slot-part="context.part"
              :data-slot-theme="context.theme"
              :data-slot-unstyled="String(context.unstyled)"
            >Inherited button</span>
          </template>
        </Button>
        <Button :unstyled="false">Explicitly styled button</Button>
        <Button :unstyled="true">Explicitly headless button</Button>
        <Input
          v-model="value"
          clearable
          data-testid="input-root"
          :parts="inputParts"
          aria-label="Search"
        >
          <template #leading="{ context }">
            <span
              data-testid="input-slot-context"
              :data-slot-part="context.part"
              :data-slot-theme="context.theme"
              :data-slot-unstyled="String(context.unstyled)"
            >⌕</span>
          </template>
        </Input>
      </ClvProvider>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const provider = canvas.getByTestId('provider')
    const inherited = canvas.getByRole('button', { name: 'Inherited button' })
    const explicitlyStyled = canvas.getByRole('button', { name: 'Explicitly styled button' })
    const explicitlyHeadless = canvas.getByRole('button', { name: 'Explicitly headless button' })

    await expect(provider).toHaveAttribute('data-clv-theme', 'default')
    await expect(inherited).toHaveAttribute('data-clv-component', 'button')
    await expect(inherited).toHaveAttribute('data-part', 'root')
    await expect(inherited).toHaveAttribute('data-resolved-theme', 'default')
    await expect(inherited).toHaveClass('clv-button')
    await expect(canvas.getByTestId('button-slot-context')).toHaveAttribute(
      'data-slot-part',
      'root',
    )
    await expect(canvas.getByTestId('button-slot-context')).toHaveAttribute(
      'data-slot-theme',
      'default',
    )
    await expect(canvas.getByTestId('button-slot-context')).toHaveAttribute(
      'data-slot-unstyled',
      'false',
    )
    await expect(canvas.getByTestId('input-slot-context')).toHaveAttribute(
      'data-slot-part',
      'leading',
    )
    await expect(explicitlyHeadless).not.toHaveClass('clv-button')
    await expect(canvas.getByTestId('input-root').tagName).toBe('DIV')
    await expect(canvas.getByTestId('input-control').tagName).toBe('SPAN')
    await expect(canvas.getByTestId('native-input').tagName).toBe('INPUT')
    await expect(canvas.getByTestId('native-input')).toHaveAttribute('autocomplete', 'off')

    await userEvent.click(canvas.getByRole('button', { name: 'Toggle theme' }))
    await expect(canvas.getByTestId('provider')).toBe(provider)
    await expect(provider).toHaveAttribute('data-clv-theme', 'aqua')
    await expect(inherited).toHaveAttribute('data-resolved-theme', 'aqua')
    await expect(canvas.getByTestId('button-slot-context')).toHaveAttribute(
      'data-slot-theme',
      'aqua',
    )

    await userEvent.click(canvas.getByRole('button', { name: 'Toggle provider styles' }))
    await expect(provider).toHaveAttribute('data-clv-unstyled', '')
    await expect(inherited).not.toHaveClass('clv-button')
    await expect(inherited).toHaveAttribute('data-resolved-unstyled', 'true')
    await expect(explicitlyStyled).toHaveClass('clv-button')
    await expect(canvas.getByTestId('button-slot-context')).toHaveAttribute(
      'data-slot-unstyled',
      'true',
    )
  },
}

export const SharedCompositionUnstyledInheritance: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'aria-hidden-focus', enabled: false },
          { id: 'color-contrast', enabled: false },
        ],
      },
    },
  },
  render: () => ({
    components: {
      Calendar,
      ClvProvider,
      DateField,
      DatePicker,
      DateRangeField,
      DateRangePicker,
      Menubar,
      NavigationMenu,
    },
    setup() {
      const date = ref(new CalendarDate(2026, 7, 15))
      const dateRange = ref({
        start: new CalendarDate(2026, 7, 10),
        end: new CalendarDate(2026, 7, 15),
      })
      const menus: MenubarMenu[] = [
        {
          value: 'file',
          label: 'File',
          entries: [
            {
              type: 'group',
              value: 'recent',
              label: 'Recent',
              items: [{ value: 'nested-action', label: 'Nested action' }],
            },
          ],
        },
      ]
      const navigationItems: NavigationMenuItem[] = [
        {
          value: 'products',
          label: 'Products',
          children: [
            {
              value: 'platform',
              label: 'Platform',
              children: [{ value: 'api', label: 'API', href: '#api' }],
            },
          ],
        },
      ]
      return { date, dateRange, menus, navigationItems }
    },
    template: `
      <ClvProvider unstyled>
        <Calendar v-model="date" />
        <DateField v-model="date" />
        <DateRangeField v-model="dateRange" />
        <DatePicker v-model="date" />
        <DateRangePicker v-model="dateRange" />
        <Menubar :menus="menus" />
        <NavigationMenu :items="navigationItems" :delay-duration="0" />
      </ClvProvider>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body)
    const rootClasses = {
      calendar: 'clv-calendar',
      'date-field': 'clv-date-field',
      'date-picker': 'clv-date-picker',
      'date-range-field': 'clv-date-field',
      'date-range-picker': 'clv-date-picker',
    }

    for (const [component, className] of Object.entries(rootClasses)) {
      const root = canvasElement.querySelector<HTMLElement>(
        `[data-clv-component="${component}"][data-part="root"]`,
      )
      await expect(root).toBeInTheDocument()
      await expect(root).toHaveAttribute('data-clv-unstyled', '')
      await expect(root).not.toHaveClass(className)
    }

    await userEvent.click(canvas.getByRole('menuitem', { name: 'File' }))
    const nestedAction = await page.findByRole('menuitem', { name: 'Nested action' })
    await expect(nestedAction).not.toHaveClass('clv-menu-entry__item')
    await userEvent.keyboard('{Escape}')

    await userEvent.hover(canvas.getByRole('button', { name: /Products/ }))
    await waitFor(async () => {
      const nestedLink = canvasElement.querySelector<HTMLElement>('a[href="#api"]')
      await expect(nestedLink).toBeInTheDocument()
      await expect(nestedLink).not.toHaveClass('clv-navigation-links__link')
    })
  },
}
