import type { DateValue, Time } from '@internationalized/date'

export type { DateValue, Time } from '@internationalized/date'

export type ClvValue = string | number

export type TimeValue = Time

export interface ClvDateRange {
  start: DateValue | undefined
  end: DateValue | undefined
}

export interface ClvTimeRange {
  start: TimeValue | undefined
  end: TimeValue | undefined
}

export type DateMatcher = (date: DateValue) => boolean

export interface DateStep {
  hour?: number
  minute?: number
  second?: number
}

export type ClvColorSpace = 'rgb' | 'hsl' | 'hsb'
export type ClvColorChannel =
  | 'red'
  | 'green'
  | 'blue'
  | 'hue'
  | 'saturation'
  | 'lightness'
  | 'brightness'
  | 'alpha'

export interface ChoiceOption {
  value: ClvValue
  label: string
  description?: string
  disabled?: boolean
}

export interface AutocompleteSuggestion {
  value: ClvValue
  label: string
  description?: string
  disabled?: boolean
  keywords?: string[]
}

export interface AccordionItem {
  value: string
  title: string
  content?: string
  disabled?: boolean
}

export interface TabItem {
  value: string
  label: string
  content?: string
  disabled?: boolean
}

export interface MenuRadioOption {
  value: ClvValue
  label: string
  disabled?: boolean
  destructive?: boolean
}

export type MenuEntry =
  | {
      type?: 'item'
      value: string
      label: string
      disabled?: boolean
      destructive?: boolean
      href?: string
      target?: string
      rel?: string
    }
  | {
      type: 'separator'
      value: string
    }
  | {
      type: 'label'
      value: string
      label: string
    }
  | {
      type: 'group'
      value: string
      label?: string
      items: MenuEntry[]
    }
  | {
      type: 'submenu'
      value: string
      label: string
      disabled?: boolean
      items: MenuEntry[]
    }
  | {
      type: 'checkbox'
      value: string
      label: string
      checked: boolean
      disabled?: boolean
      destructive?: boolean
    }
  | {
      type: 'radio-group'
      value: string
      label?: string
      selectedValue: ClvValue
      options: MenuRadioOption[]
    }

export type DropdownMenuEntry = MenuEntry

export interface MenubarMenu {
  value: string
  label: string
  disabled?: boolean
  entries: MenuEntry[]
}

export interface NavigationMenuItem {
  value: string
  label: string
  href?: string
  target?: string
  rel?: string
  description?: string
  disabled?: boolean
  children?: NavigationMenuItem[]
}

export interface SplitterPanelDefinition {
  id: string
  label: string
  defaultSize?: number
  minSize?: number
  maxSize?: number
  collapsible?: boolean
  collapsedSize?: number
  sizeUnit?: '%' | 'px'
}

export interface StepperStep {
  value: number
  title: string
  description?: string
  disabled?: boolean
  completed?: boolean
}

export interface TreeNode {
  value: ClvValue
  label: string
  description?: string
  disabled?: boolean
  children?: TreeNode[]
}

export type ToolbarEntry =
  | {
      type?: 'action'
      value: string
      label: string
      disabled?: boolean
      destructive?: boolean
    }
  | {
      type: 'link'
      value: string
      label: string
      href: string
      target?: string
      rel?: string
      disabled?: boolean
    }
  | {
      type: 'toggle'
      value: string
      label: string
      pressed?: boolean
      disabled?: boolean
    }
  | {
      type: 'separator'
      value: string
    }

export interface ColorSwatchOption {
  value: ClvValue
  color: string
  label: string
  disabled?: boolean
}

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: 'info' | 'success' | 'warning' | 'danger'
  duration?: number
  actionLabel?: string
}
