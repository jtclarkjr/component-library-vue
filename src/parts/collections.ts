import type {
  AutocompleteSuggestion,
  ChoiceOption,
  ClvValue,
  NavigationMenuItem,
  StepperStep,
  TabItem,
  ToolbarEntry,
  TreeNode,
} from '../types'
import type { ClvPartContexts, ClvParts } from './core'

export const AUTOCOMPLETE_PARTS = [
  'root',
  'label',
  'control',
  'input',
  'clear',
  'content',
  'viewport',
  'empty',
  'item',
  'description',
] as const
export type AutocompletePart = (typeof AUTOCOMPLETE_PARTS)[number]
export type AutocompletePartContext = ClvPartContexts<
  AutocompletePart,
  {
    item?: AutocompleteSuggestion
    suggestion?: AutocompleteSuggestion
    index?: number
    value?: ClvValue
    query?: string
  }
>
export type AutocompleteParts = ClvParts<AutocompletePartContext>

export const COMBOBOX_PARTS = [
  'root',
  'label',
  'control',
  'input',
  'trigger',
  'indicator',
  'clear',
  'content',
  'viewport',
  'empty',
  'item',
  'description',
] as const
export type ComboboxPart = (typeof COMBOBOX_PARTS)[number]
export type ComboboxPartContext<T extends ClvValue = ClvValue> = ClvPartContexts<
  ComboboxPart,
  { option?: ChoiceOption<T>; index?: number; value?: T }
>
export type ComboboxParts<T extends ClvValue = ClvValue> = ClvParts<ComboboxPartContext<T>>

export const LISTBOX_PARTS = [
  'root',
  'label',
  'control',
  'content',
  'empty',
  'item',
  'indicator',
  'description',
] as const
export type ListboxPart = (typeof LISTBOX_PARTS)[number]
export type ListboxPartContext<T extends ClvValue = ClvValue> = ClvPartContexts<
  ListboxPart,
  { item?: ChoiceOption<T>; index?: number; value?: T }
>
export type ListboxParts<T extends ClvValue = ClvValue> = ClvParts<ListboxPartContext<T>>

export const NAVIGATION_MENU_PARTS = [
  'root',
  'list',
  'item',
  'trigger',
  'content',
  'link',
  'viewportPosition',
  'viewport',
] as const
export type NavigationMenuPart = (typeof NAVIGATION_MENU_PARTS)[number]
export type NavigationMenuPartContext = ClvPartContexts<
  NavigationMenuPart,
  { item?: NavigationMenuItem; index?: number; depth?: number }
>
export type NavigationMenuParts = ClvParts<NavigationMenuPartContext>

export const PAGINATION_PARTS = [
  'root',
  'list',
  'first',
  'previous',
  'page',
  'ellipsis',
  'next',
  'last',
] as const
export type PaginationPart = (typeof PAGINATION_PARTS)[number]
export type PaginationPartContext = ClvPartContexts<
  PaginationPart,
  { page?: number; index?: number }
>
export type PaginationParts = ClvParts<PaginationPartContext>

export const SELECT_PARTS = [
  'root',
  'label',
  'control',
  'value',
  'icon',
  'content',
  'viewport',
  'item',
  'indicator',
  'description',
] as const
export type SelectPart = (typeof SELECT_PARTS)[number]
export type SelectPartContext<T extends ClvValue = ClvValue> = ClvPartContexts<
  SelectPart,
  { option?: ChoiceOption<T>; index?: number; value?: T }
>
export type SelectParts<T extends ClvValue = ClvValue> = ClvParts<SelectPartContext<T>>

export const STEPPER_PARTS = [
  'root',
  'list',
  'item',
  'trigger',
  'indicator',
  'title',
  'description',
  'separator',
  'panel',
  'controls',
  'previous',
  'next',
] as const
export type StepperPart = (typeof STEPPER_PARTS)[number]
export type StepperPartContext = ClvPartContexts<
  StepperPart,
  { item?: StepperStep; index?: number; value?: number }
>
export type StepperParts = ClvParts<StepperPartContext>

export const TABS_PARTS = ['root', 'list', 'trigger', 'panels', 'panel'] as const
export type TabsPart = (typeof TABS_PARTS)[number]
export type TabsPartContext = ClvPartContexts<
  TabsPart,
  { item?: TabItem; index?: number; value?: string }
>
export type TabsParts = ClvParts<TabsPartContext>

export const TOOLBAR_PARTS = ['root', 'item', 'separator'] as const
export type ToolbarPart = (typeof TOOLBAR_PARTS)[number]
export type ToolbarPartContext = ClvPartContexts<
  ToolbarPart,
  { entry?: ToolbarEntry; index?: number }
>
export type ToolbarParts = ClvParts<ToolbarPartContext>

export const TREE_PARTS = ['root', 'item', 'toggle', 'spacer', 'node'] as const
export type TreePart = (typeof TREE_PARTS)[number]
export type TreePartContext = ClvPartContexts<
  TreePart,
  { node?: TreeNode; index?: number; level?: number; selected?: boolean; expanded?: boolean }
>
export type TreeParts = ClvParts<TreePartContext>
