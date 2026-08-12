# @jtclarkjr/component-library-vue

Accessible Vue 3 components built with Reka UI, SCSS design tokens, Storybook, and the Vite+
toolchain. The package is published to npm and can also be developed and consumed entirely locally.

## Requirements

- Vue 3.5 or newer
- Bun 1.3.14 for developing this repository
- The global [<code>vp</code>](https://viteplus.dev/guide/) command

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
vp run visual:capture    # deterministic Default/Aqua/Neutral visual references
vp run build             # typed ESM library and style.css
vp run dev               # continuously rebuild the package
vp run pack:local        # build .local-pack/jtclarkjr-component-library-vue.tgz
```

## Package usage

Install the package:

```sh
vp add @jtclarkjr/component-library-vue
```

Import only the components you need and load the public stylesheet once:

```ts
import { Button, Input, Select } from '@jtclarkjr/component-library-vue'
import '@jtclarkjr/component-library-vue/style.css'
```

Components use explicit named exports and require no global Vue plugin installation.

## Usage guide

**[Read the complete consumer usage guide](https://github.com/jtclarkjr/component-library-vue/blob/main/docs/usage-guide.md).**

The guide covers first use, models and events, progressive customization, nested attribute props,
slots, CSS tokens, advanced <code>parts</code>, themes, headless composition, Storybook discovery,
local linking, tarballs, and troubleshooting. A version-matched copy is also included in every
published package at <code>docs/usage-guide.md</code>.

## Design-system and Figma workflow

The per-theme partials in <code>src/styles/tokens/</code> are the canonical token sources for
Default, Aqua, and Neutral; <code>src/styles/_tokens.scss</code> assembles them into the public
token layer. Reusable component colors, typography, spacing, radii, borders, effects, and motion
are exposed as <code>--clv-*</code> custom properties with explicit values in every base theme;
Neutral adds a light-mode color and effect override. Preserve those CSS names as Figma variable
code syntax so design and implementation stay traceable.

Storybook is the visual reconciliation surface. The tagged <code>Visual*</code> stories leave
meaningful states deterministic, and <code>vp run visual:capture</code> builds the catalogue and
captures each fixture under Default, Aqua, Neutral Dark, and Neutral Light profiles with reduced
motion. Output is written to the ignored <code>.visual-reference/</code> directory.

The design workflow can generate a local-only <code>figma/</code> handoff containing deferred Code
Connect metadata for all 62 visual public components. That directory is intentionally ignored and
is not part of the repository or npm package; <code>ClvProvider</code> remains engineering guidance
rather than a visual component. The corresponding private design library preserves stable
component-set IDs; live Code Connect activation still requires an Organization or Enterprise
Figma plan and published components. Its designer-facing UI-kit pages organize those sets into 12
reusable content blocks, 6 responsive compositions, and 4 desktop plus 4 mobile reference screens.
Local Storybook remains the visual and behavioral source of truth.

## Components

- <code>Accordion</code> — single or multiple expandable sections from typed items and scoped slots
- <code>AlertDialog</code> — focused confirmation dialog with default and destructive actions
- <code>AspectRatio</code> — responsive media frame with a controlled width-to-height ratio
- <code>Autocomplete</code> — free-form suggestions with filtering, scoped rendering, and virtualization
- <code>Avatar</code> — image avatar with accessible alt text, fallback content, sizes, and shapes
- <code>Button</code> — polymorphic button with surface/icon recipes, disabled state, and loading semantics
- <code>Calendar</code> — single or multiple date selection with bounds, localization, and multi-page views
- <code>Card</code> — composable content container with header and footer slots
- <code>Checkbox</code> — labelled boolean or indeterminate control with help and error messaging
- <code>CheckboxGroup</code> — typed multiple-choice field with shared validation and option slots
- <code>Collapsible</code> — controlled disclosure region with customizable trigger and content
- <code>ColorArea</code> — two-channel pointer and keyboard color surface with change and commit events
- <code>ColorField</code> — hexadecimal or channel-based color input with validation and preview slots
- <code>ColorSlider</code> — horizontal or vertical color-channel slider with inversion and channel steps
- <code>ColorSwatch</code> — accessible CSS-color sample with transparency checkerboard and sizes
- <code>ColorSwatchPicker</code> — single or multiple typed swatch selection with scoped options
- <code>Combobox</code> — searchable single-select field with typed options and custom filtering
- <code>ContextMenu</code> — nested rich menu opened from pointer context or the keyboard
- <code>DateField</code> — localized segmented date or date-time input using native date values
- <code>DatePicker</code> — controlled segmented date field and portal calendar popover
- <code>DateRangeField</code> — localized segmented start and end date input
- <code>DateRangePicker</code> — controlled date-range field and multi-page range calendar popover
- <code>Dialog</code> — accessible Reka UI dialog with controlled open state and composition slots
- <code>Drawer</code> — controlled, swipeable four-direction drawer with snap points and focus modes
- <code>DropdownMenu</code> — nested action, checkbox, radio, group, label, and separator menu entries
- <code>Editable</code> — inline preview and edit field with submit and cancel controls
- <code>HoverCard</code> — delayed rich preview surface for hover and keyboard focus
- <code>Input</code> — labelled text input with clear, leading/trailing, help, error, and model-value support
- <code>Label</code> — accessible form label with required, disabled, and size styling
- <code>Listbox</code> — typed single or multiple selection with orientation and optional virtualization
- <code>Menubar</code> — keyboard-navigable top-level menus using the shared recursive menu schema
- <code>MonthPicker</code> — localized single or multiple month selection
- <code>MonthRangePicker</code> — bounded month-range selection with fixed-edge support
- <code>NavigationMenu</code> — recursive link and menu navigation with rich scoped content
- <code>NumberField</code> — localized stepped numeric field with formatting and increment controls
- <code>Pagination</code> — controlled page navigation with sibling and edge controls
- <code>PinInput</code> — grouped one-time-code input with completion behavior and digit slots
- <code>Popover</code> — positioned, controlled content with a scoped close helper
- <code>Progress</code> — determinate or indeterminate progress with sizes and semantic variants
- <code>RadioGroup</code> — typed single-choice collection with orientation and field messaging
- <code>RangeCalendar</code> — localized bounded date-range selection with multi-page navigation
- <code>Rating</code> — keyboard-accessible rating control with configurable granularity
- <code>ScrollArea</code> — styled vertical, horizontal, or bidirectional custom scrollbars
- <code>Select</code> — typed single-select field with labels, validation, and scoped option rendering
- <code>Separator</code> — decorative or semantic horizontal and vertical dividers
- <code>Slider</code> — accessible single-value or range slider with keyboard support
- <code>Spinner</code> — accessible or decorative loading indicator in sizes from <code>sm</code> through <code>xl</code>
- <code>Splitter</code> — constrained resizable panels with persistence, collapse, and layout events
- <code>Stepper</code> — linear or non-linear numbered workflow with scoped navigation helpers
- <code>Switch</code> — labelled boolean control with sizes and field messaging
- <code>Tabs</code> — typed tab collections with horizontal or vertical keyboard navigation
- <code>TagsInput</code> — validated free-form tag collection with item, input, and deletion slots
- <code>TimeField</code> — localized segmented time input with granularity and step controls
- <code>TimeRangeField</code> — localized segmented start and end time input
- <code>Toast</code> — controlled notification collection with variants, actions, and swipe dismissal
- <code>Toggle</code> — accessible pressed-state button with sizes and variants
- <code>ToggleGroup</code> — typed single or multiple pressed-state button collection
- <code>Toolbar</code> — keyboard-navigable action, link, toggle, and separator records
- <code>Tooltip</code> — accessible hover/focus description with configurable placement and delay
- <code>Tree</code> — recursive scalar-ID selection and expansion with typeahead and virtualization
- <code>YearPicker</code> — localized single or multiple year selection with paged navigation
- <code>YearRangePicker</code> — bounded year-range selection with fixed-edge support

## Design principles

- Vue is a peer dependency, so consumer applications own the Vue runtime.
- Reka UI supplies accessible composite behavior; this package owns the visual styling.
- <code>@internationalized/date</code> supplies the native, locale-aware date and time value objects.
- Components use explicit imports and require no global plugin installation.
- Storybook is the public catalogue and automated component test surface.
