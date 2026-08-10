import type { Preview } from '@storybook/vue3-vite'

import '../src/styles/index.scss'
import './preview.scss'

const preview: Preview = {
  decorators: [
    (story, context) => {
      if (typeof document !== 'undefined') {
        const root = document.documentElement
        const mode = String(context.globals.mode ?? 'default')
        root.dataset.clvTheme = String(context.globals.theme ?? 'default')

        if (mode === 'default') delete root.dataset.clvThemeMode
        else root.dataset.clvThemeMode = mode
      }

      return story()
    },
  ],
  globalTypes: {
    theme: {
      description: 'Component library theme',
      toolbar: {
        icon: 'paintbrush',
        items: ['default', 'aqua', 'neutral'],
      },
    },
    mode: {
      description: 'Optional component library theme mode',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'default', title: 'Default' },
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
        ],
      },
    },
  },
  initialGlobals: {
    mode: 'default',
    theme: 'default',
  },
  parameters: {
    a11y: { test: 'error' },
    controls: { expanded: true },
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default preview
