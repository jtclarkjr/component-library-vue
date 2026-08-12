# Component Library Vue usage guide

This guide is the primary consumer documentation for
<code>@jtclarkjr/component-library-vue</code>. It starts with ordinary Vue usage, then introduces
customization progressively so most applications never need to reach directly for
<code>parts</code>.

For a component-by-component catalogue, use the repository's Storybook:

```sh
vp run storybook
```

## Install and render your first component

The package requires Vue 3.5 or newer. Install it with Vite+, Bun, npm, pnpm, or Yarn:

```sh
vp add @jtclarkjr/component-library-vue
```

Import components explicitly and import the public stylesheet once near the application entry
point. The package does not install a global Vue plugin.

```vue
<script setup lang="ts">
import { ref } from 'vue'

import { Input } from '@jtclarkjr/component-library-vue'
import '@jtclarkjr/component-library-vue/style.css'

const query = ref('')

function refresh() {
  // Run the application's search refresh.
}
</script>

<template>
  <Input
    v-model="query"
    label="Search"
    clearable
    class="search-field"
    :input-attrs="{ autocomplete: 'off' }"
    @clear="refresh"
  />
</template>
```

Vue remains a peer dependency, so the consuming application owns the Vue runtime. Reka UI and
<code>@internationalized/date</code> are installed as package dependencies.

## Behavior, models, events, and types

Use component props, models, and events before customization hooks. They own behavior, state,
forms, validation, and accessibility relationships.

### Models and events

Most form controls use ordinary <code>v-model</code>. Components with an additional controlled
state use named models such as <code>v-model:open</code> or
<code>v-model:search-term</code>. Component-specific events remain explicit.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

import { Input } from '@jtclarkjr/component-library-vue'

const email = ref('')
const error = computed(() =>
  email.value && !email.value.includes('@') ? 'Enter a valid email address' : undefined,
)
</script>

<template>
  <Input v-model="email" label="Email" type="email" required clearable :error="error" />
</template>
```

Passing <code>help</code> or <code>error</code> creates the component's description relationship.
An error also supplies the invalid state. Keep these semantics in the component API instead of
recreating them with attributes.

### Public TypeScript contracts

Data-driven components export reusable records such as <code>ChoiceOption</code>,
<code>AutocompleteSuggestion</code>, <code>MenuEntry</code>,
<code>NavigationMenuItem</code>, <code>TreeNode</code>, and
<code>ColorSwatchOption</code>. Date and time controls export <code>DateValue</code>,
<code>TimeValue</code>, <code>ClvDateRange</code>, and <code>ClvTimeRange</code>.

```ts
import type { ChoiceOption } from '@jtclarkjr/component-library-vue'

export const teams: ChoiceOption<string>[] = [
  { label: 'Platform', value: 'platform' },
  { label: 'Product', value: 'product' },
  { label: 'Archived', value: 'archived', disabled: true },
]
```

The package also exports typed part names, part contexts, and part maps for advanced composition.
Use those types with <code>satisfies</code> so part names and resolver state remain checked.

## Progressive customization

Choose the first level that solves the requirement:

1. Props, models, and events for behavior and state.
2. Normal <code>class</code>, <code>style</code>, and attributes for the component root.
3. Named slots for content and icons.
4. <code>inputAttrs</code>, <code>controlAttrs</code>, or <code>triggerAttrs</code> for a common,
   singular nested control.
5. CSS tokens and stable <code>[data-part]</code> selectors for visual changes.
6. <code>parts</code> and <code>unstyled</code> for repeated, conditional, teleported, or headless
   composition.

This order keeps ordinary application code readable while retaining the complete headless API as
an escape hatch.

### Customize the root normally

Vue fallthrough attributes continue to target the component's physical root. This is the default
place for layout, wrapper classes, test identifiers, and root-level application metadata.

```vue
<Input v-model="query" class="search-field" style="max-width: 32rem" data-testid="search-field" />
```

In this example, <code>search-field</code>, the inline style, and
<code>data-testid</code> belong to the component wrapper, not the native input.

### Replace content with slots

Use named slots when the requirement is content rather than attributes:

```vue
<Input v-model="query" label="Search" clearable>
  <template #leading>
    <SearchIcon aria-hidden="true" />
  </template>

  <template #clear-icon>
    <CloseIcon aria-hidden="true" />
  </template>
</Input>
```

Slot-owned triggers for overlays remain customizable on the element supplied by the application.
The library does not add a named attribute prop for an element it does not own.

### Customize a singular nested control

Use the named attribute prop exposed by the component:

| Attribute prop            | Components                                                                  | Target                                |
| ------------------------- | --------------------------------------------------------------------------- | ------------------------------------- |
| <code>inputAttrs</code>   | Input, Autocomplete, Combobox, ColorField, Editable, NumberField, TagsInput | Native or primitive-backed text input |
| <code>controlAttrs</code> | Checkbox, Switch                                                            | Singular interactive control          |
| <code>triggerAttrs</code> | Collapsible, Combobox, Select, DatePicker, DateRangePicker                  | Singular button-like trigger          |

Combobox exposes both <code>inputAttrs</code> and <code>triggerAttrs</code> because it owns both
interactive elements.

<code>ClvInputAttrs</code> and <code>ClvButtonAttrs</code> are based on Vue's native HTML attribute
types. They accept classes, styles, `data-*`, permitted `aria-*`, and consumer event listeners
while excluding direct DOM mutation and VNode lifecycle hooks.

#### Input

The root class remains ordinary Vue syntax; only native input attributes use
<code>inputAttrs</code>.

```vue
<script setup lang="ts">
import { ref } from 'vue'

import { Input } from '@jtclarkjr/component-library-vue'
import type { ClvInputAttrs } from '@jtclarkjr/component-library-vue'

const query = ref('')
const searchInputAttrs = {
  autocomplete: 'off',
  spellcheck: false,
  'aria-keyshortcuts': 'Control+K',
  'data-testid': 'search-input',
} satisfies ClvInputAttrs
</script>

<template>
  <Input v-model="query" label="Search" class="search-field" :input-attrs="searchInputAttrs" />
</template>
```

#### Checkbox

<code>controlAttrs</code> targets the interactive checkbox, while the ordinary class targets the
field wrapper.

```vue
<script setup lang="ts">
import { ref } from 'vue'

import { Checkbox } from '@jtclarkjr/component-library-vue'
import type { ClvButtonAttrs } from '@jtclarkjr/component-library-vue'

const accepted = ref(false)
const checkboxAttrs = {
  'aria-keyshortcuts': 'Space',
  'data-testid': 'terms-checkbox',
} satisfies ClvButtonAttrs
</script>

<template>
  <Checkbox
    v-model="accepted"
    label="I accept the terms"
    class="terms-field"
    :control-attrs="checkboxAttrs"
  />
</template>
```

#### Select

Use <code>triggerAttrs</code> for the button that opens the option list. Options are repeated
elements, so per-option attributes stay on <code>parts</code>.

```vue
<script setup lang="ts">
import { ref } from 'vue'

import { Select } from '@jtclarkjr/component-library-vue'
import type { ChoiceOption, ClvButtonAttrs } from '@jtclarkjr/component-library-vue'

const team = ref<string>()
const teams: ChoiceOption<string>[] = [
  { label: 'Platform', value: 'platform' },
  { label: 'Product', value: 'product' },
]
const selectTriggerAttrs = {
  'aria-keyshortcuts': 'Alt+ArrowDown',
  'data-testid': 'team-trigger',
} satisfies ClvButtonAttrs
</script>

<template>
  <Select
    v-model="team"
    label="Team"
    class="team-field"
    :options="teams"
    :trigger-attrs="selectTriggerAttrs"
  />
</template>
```

#### Combobox

Combobox can customize its search input and disclosure trigger independently:

```vue
<script setup lang="ts">
import { ref } from 'vue'

import { Combobox } from '@jtclarkjr/component-library-vue'
import type { ChoiceOption, ClvButtonAttrs, ClvInputAttrs } from '@jtclarkjr/component-library-vue'

const assignee = ref<string>()
const searchTerm = ref('')
const people: ChoiceOption<string>[] = [
  { label: 'Ada Lovelace', value: 'ada' },
  { label: 'Grace Hopper', value: 'grace' },
]
const comboboxInputAttrs = {
  autocomplete: 'off',
  'data-testid': 'assignee-input',
} satisfies ClvInputAttrs
const comboboxTriggerAttrs = {
  'data-testid': 'assignee-trigger',
} satisfies ClvButtonAttrs
</script>

<template>
  <Combobox
    v-model="assignee"
    v-model:search-term="searchTerm"
    label="Assignee"
    :options="people"
    :input-attrs="comboboxInputAttrs"
    :trigger-attrs="comboboxTriggerAttrs"
  />
</template>
```

### Style with tokens and data parts

The public stylesheet exposes <code>--clv-*</code> custom properties. Override them globally or
within a component root:

```css
:root {
  --clv-color-primary: #7c3aed;
  --clv-color-primary-hover: #8b5cf6;
  --clv-radius-sm: 0.6rem;
}

.search-field {
  --clv-input-bg: #18181b;
  --clv-input-radius: 0.75rem;
}
```

Every public part exposes a stable <code>data-part</code> attribute. Physical and teleported
surfaces also expose <code>data-clv-component</code>, resolved theme attributes, and applicable
state attributes.

```css
.search-field [data-part='input'] {
  letter-spacing: 0.01em;
}

[data-clv-component='select'][data-part='content'] {
  max-width: 28rem;
}
```

Prefer tokens for theme-level visual decisions and <code>[data-part]</code> for precise structural
styling.

### Use parts for repeated or state-aware targets

Use <code>parts</code> when a named attribute prop would be ambiguous or insufficient: repeated
options, calendar days, tabs, segments, tree nodes, slider thumbs, conditional resolver state, or
teleported surfaces.

#### Repeated item context

This resolver receives each Listbox option and can vary attributes per item:

```vue
<script setup lang="ts">
import { ref } from 'vue'

import { Listbox } from '@jtclarkjr/component-library-vue'
import type { ChoiceOption, ListboxParts } from '@jtclarkjr/component-library-vue'

const selection = ref<string>()
const projects: ChoiceOption<string>[] = [
  { label: 'Apollo', value: 'apollo' },
  { label: 'Legacy', value: 'legacy', disabled: true },
]
const listboxParts = {
  item: ({ item, index, disabled }) => ({
    class: ['project-option', disabled && 'project-option--disabled'],
    'data-project-id': item?.value,
    'data-option-index': index,
  }),
} satisfies ListboxParts<string>
</script>

<template>
  <Listbox v-model="selection" label="Project" :options="projects" :parts="listboxParts" />
</template>
```

#### Resolver state

Calendar-day resolvers expose state that does not belong on one shared trigger:

```vue
<script setup lang="ts">
import { ref } from 'vue'

import { DateRangePicker } from '@jtclarkjr/component-library-vue'
import type { ClvDateRange, DateRangePickerParts } from '@jtclarkjr/component-library-vue'

const dates = ref<ClvDateRange>({
  start: undefined,
  end: undefined,
})
const dateParts = {
  day: ({ today, unavailable, rangeStart, rangeEnd }) => ({
    class: [today && 'calendar-day--today', unavailable && 'calendar-day--unavailable'],
    'data-range-edge': rangeStart ? 'start' : rangeEnd ? 'end' : undefined,
  }),
} satisfies DateRangePickerParts
</script>

<template>
  <DateRangePicker v-model="dates" label="Travel dates" :number-of-months="2" :parts="dateParts" />
</template>
```

### Attribute merge order and ownership

Attributes resolve in this order:

1. Component built-ins.
2. Root fallthrough attributes, when resolving the root.
3. The named attribute prop for the nested target.
4. The advanced <code>parts</code> resolver.

Classes and styles compose instead of replacing earlier values. Event listeners also compose:
component-owned handlers run first, followed by named-attribute listeners and then
<code>parts</code> listeners. An advanced resolver therefore wins an unprotected duplicate scalar
attribute without breaking the component's own behavior.

The component retains ownership of model, form, identity, required/disabled/read-only state,
internal roles, and authoritative ARIA state and relationships. Attempts to replace protected
values such as an internal ID, model value, <code>aria-invalid</code>, or
<code>aria-describedby</code> are ignored. Use the matching component prop when behavior or
accessibility state needs to change.

### Unstyled and headless composition

Set <code>unstyled</code> on one component to remove its built-in presentation classes while
preserving structure, state, consumer attributes, data attributes, and accessibility behavior:

```vue
<Input v-model="query" unstyled class="app-input" :input-attrs="{ class: 'app-input__field' }" />
```

Use a provider for a subtree:

```vue
<ClvProvider unstyled>
  <RouterView />
</ClvProvider>
```

A child can explicitly restore library presentation with <code>:unstyled="false"</code>. Omitting
the public stylesheet is the package-wide headless path.

## Themes and providers

The Default theme works without configuration. Aqua and Neutral are bundled alternatives. For
applications with teleported overlays, setting the theme at the document boundary is the simplest
global option:

```html
<html data-clv-theme="aqua"></html>
```

Use <code>ClvProvider</code> when a theme should be reactive or scoped:

```vue
<script setup lang="ts">
import { ClvProvider } from '@jtclarkjr/component-library-vue'
</script>

<template>
  <ClvProvider theme="neutral" mode="light">
    <RouterView />
  </ClvProvider>
</template>
```

Neutral defaults to dark mode and supplies light-mode overrides. Theme modes are matched
case-insensitively and emitted in lowercase. Provider state inherits through nested providers and
propagates to library-owned teleported surfaces.

### Register an application theme

Custom themes inherit the Default recipes unless <code>extends</code> selects Aqua or Neutral.
Palette and token maps can remain partial:

```ts
import { defineClvThemes } from '@jtclarkjr/component-library-vue'

export const themes = defineClvThemes({
  brand: {
    extends: 'neutral',
    defaultMode: 'dark',
    palette: {
      bg: '#18181b',
      surface: '#27272a',
      text: '#fafafa',
      primary: '#7c3aed',
      onPrimary: '#ffffff',
    },
    tokens: {
      '--clv-radius-sm': '0.75rem',
    },
    modes: {
      light: {
        palette: {
          bg: '#ffffff',
          surface: '#ffffff',
          text: '#18181b',
        },
      },
    },
  },
})
```

```vue
<ClvProvider :themes="themes" theme="brand" mode="light">
  <RouterView />
</ClvProvider>
```

Built-in theme names are reserved. A local custom definition replaces an inherited definition with
the same name, and registered theme tokens follow library-owned teleported overlays.

## Discover component APIs in Storybook

Storybook remains the detailed component catalogue and behavioral test surface for all public
components. Clone the repository, install dependencies, and start it locally:

```sh
vp install
vp exec playwright install chromium
vp run storybook
```

Use each component's Autodocs page to inspect props, models, events, slots, visual states, and
interaction examples. The usage guide deliberately teaches shared workflows instead of duplicating
62 separate component references.

## Develop against a local checkout

Choose linking for rapid iteration or a tarball for package-faithful testing.

### Live linking

Build and register the library:

```sh
cd /path/to/component-library-vue
vp run build
vp link
vp run dev
```

Link it from the consumer:

```sh
cd /path/to/consumer
vp link @jtclarkjr/component-library-vue
```

Linked Vite consumers must deduplicate Vue and exclude the library from dependency optimization:

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

Remove the consumer link with `vp remove @jtclarkjr/component-library-vue` when the active Bun
version does not support named unlinking, then run <code>vp unlink</code> in the library repository.

### Local tarball

Build a registry-free package artifact:

```sh
cd /path/to/component-library-vue
vp run pack:local
```

Install it in the consumer:

```sh
vp add /path/to/component-library-vue/.local-pack/jtclarkjr-component-library-vue.tgz
```

The same archive works with Bun, npm, pnpm, and Yarn. Rebuild and reinstall it after each library
revision.

## Troubleshooting

### Components render without library styles

Import the public stylesheet once:

```ts
import '@jtclarkjr/component-library-vue/style.css'
```

If the stylesheet is intentionally omitted, use <code>unstyled</code>, consumer classes, tokens,
and data-part selectors as the headless styling contract.

### An attribute appears on the wrapper

Normal Vue attributes target the component root. Use <code>inputAttrs</code>,
<code>controlAttrs</code>, or <code>triggerAttrs</code> when the attribute belongs on the singular
nested control. Use <code>parts</code> for repeated or other advanced targets.

### A nested attribute is ignored

Check whether the component owns that behavior or accessibility value. Set disabled, required,
read-only, invalid, model, and related state through component props and models. Protected
attributes cannot be replaced by named attrs or <code>parts</code>.

### A linked application loads two Vue runtimes

Add <code>resolve.dedupe: ['vue']</code> and exclude the package from
<code>optimizeDeps</code> as shown in the linking section. Restart the consumer development server
after changing Vite configuration.

### A teleported overlay uses the wrong theme

Prefer theme attributes on the document boundary for one application-wide theme. When using
<code>ClvProvider</code>, ensure the overlay is owned by a library component so provider theme
state can be propagated to its detached surface.

### A tarball change is not visible

Run <code>vp run pack:local</code> again, remove the previously installed archive from the
consumer, and reinstall the rebuilt tarball. Use live linking when continuous rebuilds are more
appropriate.

## Further reference

- [Repository README](../README.md)
- [Source repository](https://github.com/jtclarkjr/component-library-vue)
- [Vite+ guide](https://viteplus.dev/guide/)
