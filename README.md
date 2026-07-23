# @jtclarkjr/component-library-vue

Accessible Vue 3 components built with Reka UI, SCSS design tokens, Storybook, and the Vite+
toolchain. The package is published to npm and can also be developed and consumed entirely locally.

## Requirements

- Vue 3.5 or newer
- Bun 1.3.14 for developing this repository
- The global [`vp`](https://viteplus.dev/guide/) command

## Install and develop

```sh
vp install
vp exec playwright install chromium
vp run storybook
```

Common commands:

```sh
vp check                 # Oxfmt, Oxlint, and type checks
vp test run              # Storybook interaction and accessibility tests
vp run build-storybook   # static Storybook catalogue
vp run build             # typed ESM library and style.css
vp run dev               # continuously rebuild the package
vp run pack:local        # build .local-pack/jtclarkjr-component-library-vue.tgz
```

## Package usage

Install the package:

```sh
vp add @jtclarkjr/component-library-vue
```

Then import its components and stylesheet:

```ts
import {
  Accordion,
  AlertDialog,
  AspectRatio,
  Autocomplete,
  Avatar,
  Button,
  Calendar,
  Card,
  Checkbox,
  CheckboxGroup,
  Collapsible,
  ColorArea,
  ColorField,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  Combobox,
  ContextMenu,
  DateField,
  DatePicker,
  DateRangeField,
  DateRangePicker,
  Dialog,
  Drawer,
  DropdownMenu,
  Editable,
  HoverCard,
  Input,
  Label,
  Listbox,
  Menubar,
  MonthPicker,
  MonthRangePicker,
  NavigationMenu,
  NumberField,
  Pagination,
  PinInput,
  Popover,
  Progress,
  RadioGroup,
  RangeCalendar,
  Rating,
  ScrollArea,
  Select,
  Separator,
  Slider,
  Spinner,
  Splitter,
  Stepper,
  Switch,
  Tabs,
  TagsInput,
  TimeField,
  TimeRangeField,
  Toast,
  Toggle,
  ToggleGroup,
  Toolbar,
  Tooltip,
  Tree,
  YearPicker,
  YearRangePicker,
} from '@jtclarkjr/component-library-vue'
import '@jtclarkjr/component-library-vue/style.css'
```

Data-driven components also export their TypeScript contracts, including `ClvValue`,
`ChoiceOption`, `MenuEntry`, `AutocompleteSuggestion`, `NavigationMenuItem`, `TreeNode`,
`SplitterPanelDefinition`, `StepperStep`, `ToolbarEntry`, and `ColorSwatchOption`. Date and time
controls export native `DateValue` and `TimeValue` models plus `ClvDateRange`, `ClvTimeRange`,
`DateMatcher`, and `DateStep`; color controls export `ClvColorSpace` and `ClvColorChannel`.

The stylesheet supplies default dark-theme tokens and all component styles. Override the public
`--clv-*` custom properties in your application to theme the components:

```css
:root {
  --clv-color-primary: #7c3aed;
  --clv-color-primary-hover: #8b5cf6;
  --clv-radius-sm: 0.6rem;
}
```

## Live local linking

Build and register the package once from this repository:

```sh
vp run build
vp link
```

Keep the compiled package updated while working:

```sh
vp run dev
```

In a Vite+/Bun consumer project, link the registered package:

```sh
vp link @jtclarkjr/component-library-vue
```

Plain Bun projects can use `bun link @jtclarkjr/component-library-vue`. Other package managers can
use their native package-link command.

For a linked Vite consumer, deduplicate Vue and keep the library out of dependency optimization:

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    dedupe: ['vue'],
  },
  optimizeDeps: {
    exclude: ['@jtclarkjr/component-library-vue'],
  },
})
```

Vite+ exposes `vp unlink @jtclarkjr/component-library-vue` for removing the consumer link. Bun
1.3.14 does not implement named unlinking yet, so projects using this repository's pinned Bun
version should remove the linked dependency with `vp remove` instead. Then unregister the package
from this repository:

```sh
# Run in the consumer project.
vp remove @jtclarkjr/component-library-vue

# Once the active package manager supports named unlinking, this is equivalent:
# vp unlink @jtclarkjr/component-library-vue

# Run in the component-library repository.
vp unlink
```

## Local tarball installation

For a package-like install without symlink behavior, create a local tarball:

```sh
vp run pack:local
```

Install it into any local Vue project:

```sh
vp add /repo/.local-pack/jtclarkjr-component-library-vue.tgz
```

The same `.tgz` path works with `bun add`, `npm install`, `pnpm add`, or `yarn add`. Rebuild and
reinstall the tarball when testing a new library revision; use linking for rapid iteration.

## Components

- `Accordion` — single or multiple expandable sections from typed items and scoped slots
- `AlertDialog` — focused confirmation dialog with default and destructive actions
- `AspectRatio` — responsive media frame with a controlled width-to-height ratio
- `Autocomplete` — free-form suggestions with filtering, scoped rendering, and virtualization
- `Avatar` — image avatar with accessible alt text, fallback content, sizes, and shapes
- `Button` — polymorphic button with variants, sizes, disabled state, and loading semantics
- `Calendar` — single or multiple date selection with bounds, localization, and multi-page views
- `Card` — composable content container with header and footer slots
- `Checkbox` — labelled boolean or indeterminate control with help and error messaging
- `CheckboxGroup` — typed multiple-choice field with shared validation and option slots
- `Collapsible` — controlled disclosure region with customizable trigger and content
- `ColorArea` — two-channel pointer and keyboard color surface with change and commit events
- `ColorField` — hexadecimal or channel-based color input with validation and preview slots
- `ColorSlider` — horizontal or vertical color-channel slider with inversion and channel steps
- `ColorSwatch` — accessible CSS-color sample with transparency checkerboard and sizes
- `ColorSwatchPicker` — single or multiple typed swatch selection with scoped options
- `Combobox` — searchable single-select field with typed options and custom filtering
- `ContextMenu` — nested rich menu opened from pointer context or the keyboard
- `DateField` — localized segmented date or date-time input using native date values
- `DatePicker` — controlled segmented date field and portal calendar popover
- `DateRangeField` — localized segmented start and end date input
- `DateRangePicker` — controlled date-range field and multi-page range calendar popover
- `Dialog` — accessible Reka UI dialog with controlled open state and composition slots
- `Drawer` — controlled, swipeable four-direction drawer with snap points and focus modes
- `DropdownMenu` — nested action, checkbox, radio, group, label, and separator menu entries
- `Editable` — inline preview and edit field with submit and cancel controls
- `HoverCard` — delayed rich preview surface for hover and keyboard focus
- `Input` — labelled text input with help, error, and model-value support
- `Label` — accessible form label with required, disabled, and size styling
- `Listbox` — typed single or multiple selection with orientation and optional virtualization
- `Menubar` — keyboard-navigable top-level menus using the shared recursive menu schema
- `MonthPicker` — localized single or multiple month selection
- `MonthRangePicker` — bounded month-range selection with fixed-edge support
- `NavigationMenu` — recursive link and menu navigation with rich scoped content
- `NumberField` — localized stepped numeric field with formatting and increment controls
- `Pagination` — controlled page navigation with sibling and edge controls
- `PinInput` — grouped one-time-code input with completion behavior and digit slots
- `Popover` — positioned, controlled content with a scoped close helper
- `Progress` — determinate or indeterminate progress with sizes and semantic variants
- `RadioGroup` — typed single-choice collection with orientation and field messaging
- `RangeCalendar` — localized bounded date-range selection with multi-page navigation
- `Rating` — keyboard-accessible rating control with configurable granularity
- `ScrollArea` — styled vertical, horizontal, or bidirectional custom scrollbars
- `Select` — typed single-select field with labels, validation, and scoped option rendering
- `Separator` — decorative or semantic horizontal and vertical dividers
- `Slider` — accessible single-value or range slider with keyboard support
- `Spinner` — accessible or decorative loading indicator
- `Splitter` — constrained resizable panels with persistence, collapse, and layout events
- `Stepper` — linear or non-linear numbered workflow with scoped navigation helpers
- `Switch` — labelled boolean control with sizes and field messaging
- `Tabs` — typed tab collections with horizontal or vertical keyboard navigation
- `TagsInput` — validated free-form tag collection with item, input, and deletion slots
- `TimeField` — localized segmented time input with granularity and step controls
- `TimeRangeField` — localized segmented start and end time input
- `Toast` — controlled notification collection with variants, actions, and swipe dismissal
- `Toggle` — accessible pressed-state button with sizes and variants
- `ToggleGroup` — typed single or multiple pressed-state button collection
- `Toolbar` — keyboard-navigable action, link, toggle, and separator records
- `Tooltip` — accessible hover/focus description with configurable placement and delay
- `Tree` — recursive scalar-ID selection and expansion with typeahead and virtualization
- `YearPicker` — localized single or multiple year selection with paged navigation
- `YearRangePicker` — bounded year-range selection with fixed-edge support

## Design principles

- Vue is a peer dependency, so consumer applications own the Vue runtime.
- Reka UI supplies accessible composite behavior; this package owns the visual styling.
- `@internationalized/date` supplies the native, locale-aware date and time value objects.
- Components use explicit imports and require no global plugin installation.
- Storybook is the public catalogue and automated component test surface.
