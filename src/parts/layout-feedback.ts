import type { ToastItem } from '../types'
import type { ClvPartContexts, ClvParts } from './core'

export const SCROLL_AREA_PARTS = ['root', 'viewport', 'scrollbar', 'thumb', 'corner'] as const
export type ScrollAreaPart = (typeof SCROLL_AREA_PARTS)[number]
export type ScrollAreaPartContext = ClvPartContexts<ScrollAreaPart>
export type ScrollAreaParts = ClvParts<ScrollAreaPartContext>

export const SPLITTER_PARTS = ['root', 'panel', 'handle'] as const
export type SplitterPart = (typeof SPLITTER_PARTS)[number]
export type SplitterPartContext = ClvPartContexts<SplitterPart, { index?: number }>
export type SplitterParts = ClvParts<SplitterPartContext>

export const TOAST_PARTS = [
  'root',
  'viewport',
  'toast',
  'content',
  'title',
  'description',
  'action',
  'close',
] as const
export type ToastPart = (typeof TOAST_PARTS)[number]
export type ToastPartContext = ClvPartContexts<ToastPart, { item?: ToastItem; index?: number }>
export type ToastParts = ClvParts<ToastPartContext>
