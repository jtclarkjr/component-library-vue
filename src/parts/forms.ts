import type { ChoiceOption, ClvColorChannel, ClvValue, ColorSwatchOption } from '../types'
import type { ClvPartContexts, ClvParts } from './core'

export const CHECKBOX_PARTS = ['root', 'control', 'indicator', 'label', 'description'] as const
export type CheckboxPart = (typeof CHECKBOX_PARTS)[number]
export type CheckboxPartContext = ClvPartContexts<CheckboxPart>
export type CheckboxParts = ClvParts<CheckboxPartContext>

export const CHECKBOX_GROUP_PARTS = [
  'root',
  'label',
  'group',
  'option',
  'control',
  'indicator',
  'description',
] as const
export type CheckboxGroupPart = (typeof CHECKBOX_GROUP_PARTS)[number]
export type CheckboxGroupPartContext<T extends ClvValue = ClvValue> = ClvPartContexts<
  CheckboxGroupPart,
  { option?: ChoiceOption<T>; index?: number; value?: T }
>
export type CheckboxGroupParts<T extends ClvValue = ClvValue> = ClvParts<
  CheckboxGroupPartContext<T>
>

export const COLOR_AREA_PARTS = ['root', 'surface', 'thumb', 'thumbSwatch'] as const
export type ColorAreaPart = (typeof COLOR_AREA_PARTS)[number]
export type ColorAreaPartContext = ClvPartContexts<
  ColorAreaPart,
  { value?: string; xChannel?: ClvColorChannel; yChannel?: ClvColorChannel }
>
export type ColorAreaParts = ClvParts<ColorAreaPartContext>

export const COLOR_FIELD_PARTS = [
  'root',
  'label',
  'control',
  'preview',
  'input',
  'description',
] as const
export type ColorFieldPart = (typeof COLOR_FIELD_PARTS)[number]
export type ColorFieldPartContext = ClvPartContexts<
  ColorFieldPart,
  { value?: string; channel?: ClvColorChannel }
>
export type ColorFieldParts = ClvParts<ColorFieldPartContext>

export const COLOR_SLIDER_PARTS = ['root', 'track', 'thumb', 'thumbSwatch'] as const
export type ColorSliderPart = (typeof COLOR_SLIDER_PARTS)[number]
export type ColorSliderPartContext = ClvPartContexts<
  ColorSliderPart,
  { value?: string; channel?: ClvColorChannel }
>
export type ColorSliderParts = ClvParts<ColorSliderPartContext>

export const COLOR_SWATCH_PARTS = ['root', 'swatch'] as const
export type ColorSwatchPart = (typeof COLOR_SWATCH_PARTS)[number]
export type ColorSwatchPartContext = ClvPartContexts<ColorSwatchPart, { color?: string }>
export type ColorSwatchParts = ClvParts<ColorSwatchPartContext>

export const COLOR_SWATCH_PICKER_PARTS = [
  'root',
  'option',
  'checker',
  'swatch',
  'label',
  'indicator',
] as const
export type ColorSwatchPickerPart = (typeof COLOR_SWATCH_PICKER_PARTS)[number]
export type ColorSwatchPickerPartContext = ClvPartContexts<
  ColorSwatchPickerPart,
  {
    item?: ColorSwatchOption
    option?: ColorSwatchOption
    index?: number
    value?: ClvValue
    selected?: boolean
  }
>
export type ColorSwatchPickerParts = ClvParts<ColorSwatchPickerPartContext>

export const EDITABLE_PARTS = [
  'root',
  'label',
  'control',
  'area',
  'preview',
  'input',
  'actions',
  'edit',
  'submit',
  'cancel',
  'description',
] as const
export type EditablePart = (typeof EDITABLE_PARTS)[number]
export type EditablePartContext = ClvPartContexts<EditablePart>
export type EditableParts = ClvParts<EditablePartContext>

export const NUMBER_FIELD_PARTS = [
  'root',
  'label',
  'control',
  'decrement',
  'input',
  'increment',
  'description',
] as const
export type NumberFieldPart = (typeof NUMBER_FIELD_PARTS)[number]
export type NumberFieldPartContext = ClvPartContexts<NumberFieldPart>
export type NumberFieldParts = ClvParts<NumberFieldPartContext>

export const PIN_INPUT_PARTS = ['root', 'label', 'group', 'digit', 'description'] as const
export type PinInputPart = (typeof PIN_INPUT_PARTS)[number]
export type PinInputPartContext = ClvPartContexts<PinInputPart, { index?: number }>
export type PinInputParts = ClvParts<PinInputPartContext>

export const RADIO_GROUP_PARTS = [
  'root',
  'label',
  'group',
  'option',
  'control',
  'indicator',
  'description',
] as const
export type RadioGroupPart = (typeof RADIO_GROUP_PARTS)[number]
export type RadioGroupPartContext<T extends ClvValue = ClvValue> = ClvPartContexts<
  RadioGroupPart,
  { option?: ChoiceOption<T>; index?: number; value?: T }
>
export type RadioGroupParts<T extends ClvValue = ClvValue> = ClvParts<RadioGroupPartContext<T>>

export const RATING_PARTS = [
  'root',
  'label',
  'group',
  'item',
  'empty',
  'indicator',
  'value',
  'description',
] as const
export type RatingPart = (typeof RATING_PARTS)[number]
export type RatingPartContext = ClvPartContexts<RatingPart, { value?: number; index?: number }>
export type RatingParts = ClvParts<RatingPartContext>

export const SLIDER_PARTS = ['root', 'track', 'range', 'thumb'] as const
export type SliderPart = (typeof SLIDER_PARTS)[number]
export type SliderPartContext = ClvPartContexts<SliderPart, { index?: number; value?: number }>
export type SliderParts = ClvParts<SliderPartContext>

export const SWITCH_PARTS = ['root', 'control', 'thumb', 'label', 'description'] as const
export type SwitchPart = (typeof SWITCH_PARTS)[number]
export type SwitchPartContext = ClvPartContexts<SwitchPart>
export type SwitchParts = ClvParts<SwitchPartContext>

export const TAGS_INPUT_PARTS = [
  'root',
  'label',
  'control',
  'tag',
  'tagContent',
  'delete',
  'input',
  'clear',
  'description',
] as const
export type TagsInputPart = (typeof TAGS_INPUT_PARTS)[number]
export type TagsInputPartContext = ClvPartContexts<TagsInputPart, { item?: string; index?: number }>
export type TagsInputParts = ClvParts<TagsInputPartContext>

export const TOGGLE_PARTS = ['root'] as const
export type TogglePart = (typeof TOGGLE_PARTS)[number]
export type TogglePartContext = ClvPartContexts<TogglePart>
export type ToggleParts = ClvParts<TogglePartContext>

export const TOGGLE_GROUP_PARTS = ['root', 'label', 'group', 'item'] as const
export type ToggleGroupPart = (typeof TOGGLE_GROUP_PARTS)[number]
export type ToggleGroupPartContext = ClvPartContexts<
  ToggleGroupPart,
  { item?: unknown; index?: number; value?: ClvValue }
>
export type ToggleGroupParts = ClvParts<ToggleGroupPartContext>
