import type { ClvPartContexts, ClvParts } from './core'

export const ASPECT_RATIO_PARTS = ['root'] as const
export type AspectRatioPart = (typeof ASPECT_RATIO_PARTS)[number]
export type AspectRatioPartContext = ClvPartContexts<AspectRatioPart>
export type AspectRatioParts = ClvParts<AspectRatioPartContext>

export const AVATAR_PARTS = ['root', 'image', 'fallback'] as const
export type AvatarPart = (typeof AVATAR_PARTS)[number]
export type AvatarPartContext = ClvPartContexts<AvatarPart>
export type AvatarParts = ClvParts<AvatarPartContext>

export const BUTTON_PARTS = ['root', 'loader'] as const
export type ButtonPart = (typeof BUTTON_PARTS)[number]
export type ButtonPartContext = ClvPartContexts<ButtonPart, { size: string; variant: string }>
export type ButtonParts = ClvParts<ButtonPartContext>

export const CARD_PARTS = ['root', 'header', 'title', 'body', 'footer'] as const
export type CardPart = (typeof CARD_PARTS)[number]
export type CardPartContext = ClvPartContexts<CardPart>
export type CardParts = ClvParts<CardPartContext>

export const INPUT_PARTS = [
  'root',
  'label',
  'control',
  'input',
  'leading',
  'trailing',
  'clear',
  'description',
] as const
export type InputPart = (typeof INPUT_PARTS)[number]
export type InputPartContext = ClvPartContexts<InputPart>
export type InputParts = ClvParts<InputPartContext>

export const LABEL_PARTS = ['root', 'required'] as const
export type LabelPart = (typeof LABEL_PARTS)[number]
export type LabelPartContext = ClvPartContexts<LabelPart>
export type LabelParts = ClvParts<LabelPartContext>

export const PROGRESS_PARTS = ['root', 'label', 'value', 'track', 'indicator'] as const
export type ProgressPart = (typeof PROGRESS_PARTS)[number]
export type ProgressPartContext = ClvPartContexts<ProgressPart>
export type ProgressParts = ClvParts<ProgressPartContext>

export const SEPARATOR_PARTS = ['root'] as const
export type SeparatorPart = (typeof SEPARATOR_PARTS)[number]
export type SeparatorPartContext = ClvPartContexts<SeparatorPart>
export type SeparatorParts = ClvParts<SeparatorPartContext>

export const SPINNER_PARTS = ['root'] as const
export type SpinnerPart = (typeof SPINNER_PARTS)[number]
export type SpinnerPartContext = ClvPartContexts<SpinnerPart, { size: string }>
export type SpinnerParts = ClvParts<SpinnerPartContext>
