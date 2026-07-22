# component-library-vue

Accessible Vue 3 components built with Reka UI, SCSS design tokens, Storybook, and the Vite+
toolchain. The package can be developed and consumed entirely locally without publishing to GitHub
or a registry.

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
vp run pack:local        # build .local-pack/component-library-vue.tgz
```

## Package usage

Install or link the package, then import its components and stylesheet:

```ts
import { Button, Card, Dialog, Input, Spinner } from 'component-library-vue'
import 'component-library-vue/style.css'
```

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
vp link component-library-vue
```

Plain Bun projects can use `bun link component-library-vue`. Other package managers can use their
native package-link command.

For a linked Vite consumer, deduplicate Vue and keep the library out of dependency optimization:

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    dedupe: ['vue'],
  },
  optimizeDeps: {
    exclude: ['component-library-vue'],
  },
})
```

Vite+ exposes `vp unlink component-library-vue` for removing the consumer link. Bun 1.3.14 does
not implement named unlinking yet, so projects using this repository's pinned Bun version should
remove the linked dependency with `vp remove` instead. Then unregister the package from this
repository:

```sh
# Run in the consumer project.
vp remove component-library-vue

# Once the active package manager supports named unlinking, this is equivalent:
# vp unlink component-library-vue

# Run in component-library-vue.
vp unlink
```

## Local tarball installation

For a package-like install without symlink behavior, create a local tarball:

```sh
vp run pack:local
```

Install it into any local Vue project:

```sh
vp add /repo/.local-pack/component-library-vue.tgz
```

The same `.tgz` path works with `bun add`, `npm install`, `pnpm add`, or `yarn add`. Rebuild and
reinstall the tarball when testing a new library revision; use linking for rapid iteration.

## Components

- `Button` — polymorphic button with variants, sizes, disabled state, and loading semantics
- `Card` — composable content container with header and footer slots
- `Dialog` — accessible Reka UI dialog with controlled open state and composition slots
- `Input` — labelled text input with help, error, and model-value support
- `Spinner` — accessible or decorative loading indicator

## Design principles

- Vue is a peer dependency, so consumer applications own the Vue runtime.
- Reka UI supplies accessible composite behavior; this package owns the visual styling.
- Components use explicit imports and require no global plugin installation.
- Storybook is the public catalogue and automated component test surface.
