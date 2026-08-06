import type { MenuEntry } from '../types'
import type { ClvPartContexts, ClvParts } from './core'

type MenuPartState = {
  entry?: MenuEntry
  index?: number
  depth?: number
  kind?: string
  checked?: boolean
  destructive?: boolean
}

export const ACCORDION_PARTS = [
  'root',
  'item',
  'header',
  'trigger',
  'icon',
  'content',
  'contentInner',
] as const
export type AccordionPart = (typeof ACCORDION_PARTS)[number]
export type AccordionPartContext = ClvPartContexts<
  AccordionPart,
  { value?: string; index?: number }
>
export type AccordionParts = ClvParts<AccordionPartContext>

export const ALERT_DIALOG_PARTS = [
  'root',
  'trigger',
  'overlay',
  'content',
  'title',
  'description',
  'body',
  'footer',
  'cancel',
  'action',
] as const
export type AlertDialogPart = (typeof ALERT_DIALOG_PARTS)[number]
export type AlertDialogPartContext = ClvPartContexts<AlertDialogPart>
export type AlertDialogParts = ClvParts<AlertDialogPartContext>

export const COLLAPSIBLE_PARTS = ['root', 'trigger', 'icon', 'content', 'contentInner'] as const
export type CollapsiblePart = (typeof COLLAPSIBLE_PARTS)[number]
export type CollapsiblePartContext = ClvPartContexts<CollapsiblePart>
export type CollapsibleParts = ClvParts<CollapsiblePartContext>

export const CONTEXT_MENU_PARTS = [
  'root',
  'trigger',
  'content',
  'group',
  'label',
  'separator',
  'item',
  'submenuTrigger',
  'submenuContent',
  'checkboxItem',
  'radioItem',
  'indicator',
] as const
export type ContextMenuPart = (typeof CONTEXT_MENU_PARTS)[number]
export type ContextMenuPartContext = ClvPartContexts<ContextMenuPart, MenuPartState>
export type ContextMenuParts = ClvParts<ContextMenuPartContext>

export const DIALOG_PARTS = [
  'root',
  'trigger',
  'overlay',
  'content',
  'header',
  'title',
  'description',
  'close',
  'body',
  'footer',
] as const
export type DialogPart = (typeof DIALOG_PARTS)[number]
export type DialogPartContext = ClvPartContexts<DialogPart>
export type DialogParts = ClvParts<DialogPartContext>

export const DRAWER_PARTS = [
  'root',
  'trigger',
  'overlay',
  'content',
  'handle',
  'header',
  'title',
  'description',
  'close',
  'body',
  'footer',
] as const
export type DrawerPart = (typeof DRAWER_PARTS)[number]
export type DrawerPartContext = ClvPartContexts<DrawerPart>
export type DrawerParts = ClvParts<DrawerPartContext>

export const DROPDOWN_MENU_PARTS = [
  'root',
  'trigger',
  'content',
  'group',
  'label',
  'separator',
  'item',
  'submenuTrigger',
  'submenuContent',
  'checkboxItem',
  'radioItem',
  'indicator',
] as const
export type DropdownMenuPart = (typeof DROPDOWN_MENU_PARTS)[number]
export type DropdownMenuPartContext = ClvPartContexts<DropdownMenuPart, MenuPartState>
export type DropdownMenuParts = ClvParts<DropdownMenuPartContext>

export const HOVER_CARD_PARTS = ['root', 'trigger', 'content'] as const
export type HoverCardPart = (typeof HOVER_CARD_PARTS)[number]
export type HoverCardPartContext = ClvPartContexts<HoverCardPart>
export type HoverCardParts = ClvParts<HoverCardPartContext>

export const MENUBAR_PARTS = [
  'root',
  'trigger',
  'content',
  'group',
  'label',
  'separator',
  'item',
  'submenuTrigger',
  'submenuContent',
  'checkboxItem',
  'radioItem',
  'indicator',
] as const
export type MenubarPart = (typeof MENUBAR_PARTS)[number]
export type MenubarPartContext = ClvPartContexts<MenubarPart, MenuPartState>
export type MenubarParts = ClvParts<MenubarPartContext>

export const POPOVER_PARTS = ['root', 'trigger', 'content', 'arrow'] as const
export type PopoverPart = (typeof POPOVER_PARTS)[number]
export type PopoverPartContext = ClvPartContexts<PopoverPart>
export type PopoverParts = ClvParts<PopoverPartContext>

export const TOOLTIP_PARTS = ['root', 'trigger', 'content', 'arrow'] as const
export type TooltipPart = (typeof TOOLTIP_PARTS)[number]
export type TooltipPartContext = ClvPartContexts<TooltipPart>
export type TooltipParts = ClvParts<TooltipPartContext>
