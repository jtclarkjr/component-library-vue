# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Provider-local custom theme registries with typed semantic palettes, advanced token overrides,
  bundled-theme inheritance, custom named modes, nested-provider composition, and automatic token
  propagation to teleported surfaces.
- Progressive `inputAttrs`, `controlAttrs`, and `triggerAttrs` hooks for common nested interactive
  targets, backed by public safe native-attribute types while retaining `parts` for advanced use.

## [0.4.1] - 2026-08-11

### Changed

- Aligned Neutral's light and dark interface chrome with a OKLCH grayscale palette,
  including subtler borders and token-derived interactive states, while preserving its colored
  status semantics and existing theme-mode behavior.

## [0.4.0] - 2026-08-11

### Added

- A built-in grayscale `neutral` theme with dark and light palettes, Aqua-derived component
  recipes, and mode-aware Storybook visual references.
- Optional inherited `ClvProvider` theme modes, public mode types and constants, and propagated
  `data-clv-theme-mode` attributes for physical and teleported component surfaces.

### Changed

- Made provider mode inputs and Neutral's direct mode selector case-insensitive while keeping all
  resolved contexts and emitted `data-clv-theme-mode` values canonical and reactively synchronized.
- Split the built-in theme tokens into dedicated Default, Aqua, and Neutral partials while
  preserving the generated public stylesheet and complete nested-theme resets.
- Split the headless implementation into focused attribute-policy, composable, constant, context,
  helper, and type modules while preserving the existing barrel exports and component behavior.
- Aligned the Vite compatibility alias and override with Vite+ 0.2.7 so configuration and plugin
  types resolve against the same Vite core.

## [0.3.2] - 2026-08-10

### Added

- Deterministic `Visual*` Storybook fixtures and a Default/Aqua capture workflow for reconciling
  component states with design artifacts.
- Documentation for a local-only deferred Code Connect workflow covering all 62 visual public
  components, their Storybook references, canonical parts, imports, and exact visible API
  mappings.
- Figma design-system handoff guidance for foundations, component anatomy, publication, and future
  parserless `.figma.ts` activation through `figma.code`.
- The connected “Component Library Vue — Design System” Drafts file with Default/Aqua variables,
  shared text/effect styles, 62 public component sets, hidden primitives, and stable manifest IDs.
- Designer-facing UI-kit catalogue pages with 12 reusable content blocks, 6 responsive
  compositions, and 4 desktop plus 4 mobile Storybook-reconciled reference screens.

### Changed

- Expanded the public CSS-token surface with explicit Default and Aqua values while preserving the
  existing Vue component API and rendered presentation.

### Fixed

- Kept Vitest browser error tracking enabled while filtering only Chromium's known undelivered
  `ResizeObserver` notification from the ScrollArea visual fixture.
- Completed the Default theme's component-token overrides so a nested Default provider no longer
  inherits Aqua-only field geometry from an Aqua ancestor.

## [0.3.1] - 2026-08-06

### Fixed

- Restored Aqua Select's centered stroke chevron after direct consumers no longer inherited the
  former AniChart wrapper recipe, while preserving the default theme, custom icon slot, and
  unstyled presentation.

## [0.3.0] - 2026-08-06

### Added

- Typed `parts` resolver contracts, stable component/part data attributes, and additive unstyled
  presentation control across the public component suite.
- `ClvProvider` for SSR-safe inherited themes and presentation state, plus the built-in `aqua`
  theme and direct `data-clv-theme` activation.
- Native Button `surface` and `icon` recipes, Input clear and adornment APIs, generic Select option
  values, and the `xl` Spinner size.

### Changed

- Moved portal presentation rules into the global package stylesheet so teleported surfaces retain
  their component styles and provider theme state.
- Replaced fixed component colors with public theme tokens while preserving the default theme,
  existing props, slots, events, DOM structure, and legacy `clv-*` classes.

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
