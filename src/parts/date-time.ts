import type { ClvPartContexts, ClvParts } from './core'

type CalendarPartState = {
  date?: unknown
  month?: unknown
  index?: number
  today?: boolean
  outside?: boolean
  unavailable?: boolean
  rangeStart?: boolean
  rangeEnd?: boolean
  selected?: boolean
}

type FieldPartState = {
  segment?: unknown
  index?: number
  rangePart?: 'start' | 'end'
  placeholder?: boolean
}

type PeriodPartState = {
  date?: unknown
  value?: string | number
  index?: number
  rowIndex?: number
  today?: boolean
  unavailable?: boolean
  rangeStart?: boolean
  rangeEnd?: boolean
  selected?: boolean
}

type DateRangePickerPartState = CalendarPartState & {
  segment?: unknown
  rangePart?: 'start' | 'end'
}

export const CALENDAR_PARTS = [
  'root',
  'header',
  'previous',
  'heading',
  'next',
  'months',
  'grid',
  'weekdays',
  'weekday',
  'week',
  'cell',
  'day',
] as const
export type CalendarPart = (typeof CALENDAR_PARTS)[number]
export type CalendarPartContext = ClvPartContexts<CalendarPart, CalendarPartState>
export type CalendarParts = ClvParts<CalendarPartContext>

export const DATE_FIELD_PARTS = ['root', 'label', 'segments', 'segment', 'description'] as const
export type DateFieldPart = (typeof DATE_FIELD_PARTS)[number]
export type DateFieldPartContext = ClvPartContexts<DateFieldPart, FieldPartState>
export type DateFieldParts = ClvParts<DateFieldPartContext>

export const DATE_PICKER_PARTS = [
  'root',
  'label',
  'control',
  'segments',
  'segment',
  'trigger',
  'content',
  'calendar',
  'header',
  'previous',
  'heading',
  'next',
  'months',
  'grid',
  'weekdays',
  'weekday',
  'week',
  'cell',
  'day',
  'footer',
  'description',
] as const
export type DatePickerPart = (typeof DATE_PICKER_PARTS)[number]
export type DatePickerPartContext = ClvPartContexts<
  DatePickerPart,
  CalendarPartState & { segment?: unknown }
>
export type DatePickerParts = ClvParts<DatePickerPartContext>

export const DATE_RANGE_FIELD_PARTS = [
  'root',
  'label',
  'segments',
  'startRange',
  'endRange',
  'segment',
  'separator',
  'description',
] as const
export type DateRangeFieldPart = (typeof DATE_RANGE_FIELD_PARTS)[number]
export type DateRangeFieldPartContext = ClvPartContexts<DateRangeFieldPart, FieldPartState>
export type DateRangeFieldParts = ClvParts<DateRangeFieldPartContext>

export const DATE_RANGE_PICKER_PARTS = [
  'root',
  'label',
  'control',
  'segments',
  'startRange',
  'endRange',
  'segment',
  'separator',
  'trigger',
  'content',
  'calendar',
  'header',
  'previous',
  'heading',
  'next',
  'months',
  'grid',
  'weekdays',
  'weekday',
  'week',
  'cell',
  'day',
  'footer',
  'description',
] as const
export type DateRangePickerPart = (typeof DATE_RANGE_PICKER_PARTS)[number]
export type DateRangePickerPartContext = ClvPartContexts<
  DateRangePickerPart,
  DateRangePickerPartState
>
export type DateRangePickerParts = ClvParts<DateRangePickerPartContext>

export const MONTH_PICKER_PARTS = [
  'root',
  'header',
  'previous',
  'heading',
  'next',
  'grid',
  'row',
  'cell',
  'option',
] as const
export type MonthPickerPart = (typeof MONTH_PICKER_PARTS)[number]
export type MonthPickerPartContext = ClvPartContexts<MonthPickerPart, PeriodPartState>
export type MonthPickerParts = ClvParts<MonthPickerPartContext>

export const MONTH_RANGE_PICKER_PARTS = [
  'root',
  'header',
  'previous',
  'heading',
  'next',
  'grid',
  'row',
  'cell',
  'option',
] as const
export type MonthRangePickerPart = (typeof MONTH_RANGE_PICKER_PARTS)[number]
export type MonthRangePickerPartContext = ClvPartContexts<MonthRangePickerPart, PeriodPartState>
export type MonthRangePickerParts = ClvParts<MonthRangePickerPartContext>

export const RANGE_CALENDAR_PARTS = [
  'root',
  'header',
  'previous',
  'heading',
  'next',
  'months',
  'grid',
  'weekdays',
  'weekday',
  'week',
  'cell',
  'day',
] as const
export type RangeCalendarPart = (typeof RANGE_CALENDAR_PARTS)[number]
export type RangeCalendarPartContext = ClvPartContexts<RangeCalendarPart, CalendarPartState>
export type RangeCalendarParts = ClvParts<RangeCalendarPartContext>

export const TIME_FIELD_PARTS = ['root', 'label', 'segments', 'segment', 'description'] as const
export type TimeFieldPart = (typeof TIME_FIELD_PARTS)[number]
export type TimeFieldPartContext = ClvPartContexts<TimeFieldPart, FieldPartState>
export type TimeFieldParts = ClvParts<TimeFieldPartContext>

export const TIME_RANGE_FIELD_PARTS = [
  'root',
  'label',
  'segments',
  'startRange',
  'endRange',
  'segment',
  'separator',
  'description',
] as const
export type TimeRangeFieldPart = (typeof TIME_RANGE_FIELD_PARTS)[number]
export type TimeRangeFieldPartContext = ClvPartContexts<TimeRangeFieldPart, FieldPartState>
export type TimeRangeFieldParts = ClvParts<TimeRangeFieldPartContext>

export const YEAR_PICKER_PARTS = [
  'root',
  'header',
  'previous',
  'heading',
  'next',
  'grid',
  'row',
  'cell',
  'option',
] as const
export type YearPickerPart = (typeof YEAR_PICKER_PARTS)[number]
export type YearPickerPartContext = ClvPartContexts<YearPickerPart, PeriodPartState>
export type YearPickerParts = ClvParts<YearPickerPartContext>

export const YEAR_RANGE_PICKER_PARTS = [
  'root',
  'header',
  'previous',
  'heading',
  'next',
  'grid',
  'row',
  'cell',
  'option',
] as const
export type YearRangePickerPart = (typeof YEAR_RANGE_PICKER_PARTS)[number]
export type YearRangePickerPartContext = ClvPartContexts<YearRangePickerPart, PeriodPartState>
export type YearRangePickerParts = ClvParts<YearRangePickerPartContext>
