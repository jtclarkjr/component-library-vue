export type ClvValue = string | number

export interface ChoiceOption {
  value: ClvValue
  label: string
  description?: string
  disabled?: boolean
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

export type DropdownMenuEntry =
  | {
      type?: 'item'
      value: string
      label: string
      disabled?: boolean
      destructive?: boolean
    }
  | {
      type: 'separator'
      value: string
    }

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: 'info' | 'success' | 'warning' | 'danger'
  duration?: number
  actionLabel?: string
}
