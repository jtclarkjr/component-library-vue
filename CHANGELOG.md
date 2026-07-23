# Changelog

All notable changes to this project will be documented in this file.

## [0.2.1] - 2026-07-23

### Changed

- Renamed the npm package to `@jtclarkjr/component-library-vue` to publish under the maintainer's
  personal scope and avoid the unrelated pre-existing unscoped package.
- Added repository, homepage, and issue-tracker metadata to the published package.

## [0.2.0] - 2026-07-23

### Added

- Thirty-seven styled Reka UI wrappers, completing a 62-component public suite: AspectRatio,
  Autocomplete, Calendar, CheckboxGroup, ColorArea, ColorField, ColorSlider, ColorSwatch,
  ColorSwatchPicker, ContextMenu, DateField, DatePicker, DateRangeField, DateRangePicker, Drawer,
  Editable, HoverCard, Label, Listbox, Menubar, MonthPicker, MonthRangePicker, NavigationMenu,
  NumberField, PinInput, RangeCalendar, Rating, Splitter, Stepper, TagsInput, TimeField,
  TimeRangeField, ToggleGroup, Toolbar, Tree, YearPicker, and YearRangePicker.
- Native `DateValue` and `TimeValue` date/time models through `@internationalized/date`, plus
  public range, matcher, step, color-space, color-channel, menu, navigation, splitter, stepper,
  toolbar, tree, autocomplete, and swatch records.
- Optional virtualization for Autocomplete, Listbox, and Tree; recursive rich menu records;
  controlled drawers and pickers; calendar and segmented date/time fields; CSS-string color
  controls; and single or multiple color swatch selection.
- Storybook autodocs and interaction/accessibility coverage for all 62 public components,
  including nested menus, virtualization, keyboard selection, portal dismissal, date/time
  segments, localized calendars, and color commits.

### Changed

- Expanded DropdownMenu compatibly to actions, labels, separators, groups, submenus, checkbox
  items, and radio groups, with matching ContextMenu and Menubar behavior.
- Expanded the public dark-theme tokens and mixins for advanced menus, segmented fields,
  drawers, trees, resize handles, calendars, checkerboards, and color surfaces.
- Externalized `@internationalized/date` alongside Vue and Reka UI in the package build while
  preserving the root named-export and `component-library-vue/style.css` contracts.

## [0.1.0] - 2026-07-22

### Added

- Twenty styled Reka UI wrappers: Accordion, AlertDialog, Avatar, Checkbox, Collapsible,
  Combobox, DropdownMenu, Pagination, Popover, Progress, RadioGroup, ScrollArea, Select,
  Separator, Slider, Switch, Tabs, Toast, Toggle, and Tooltip.
- Public `ClvValue`, `ChoiceOption`, `AccordionItem`, `TabItem`, `DropdownMenuEntry`, and
  `ToastItem` types for collection-based component APIs.
- Shared SCSS tokens and mixins for fields, focus rings, disabled states, floating surfaces,
  feedback colors, overlay motion, and reduced-motion preferences.
- Storybook autodocs, visual states, accessibility checks, and interaction coverage for the
  expanded component suite.

### Changed

- Expanded the public named-export API from five to twenty-five components while preserving the
  existing Button, Card, Dialog, Input, and Spinner APIs.
- Extended the dark theme with consumer-overridable feedback, shadow, focus, overlay, and motion
  tokens.
