import type { Preview } from '@storybook/vue3-vite'

import '../src/styles/index.scss'
import './preview.scss'

const preview: Preview = {
  decorators: [
    (story, context) => {
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.clvTheme = String(context.globals.theme ?? 'default')
      }

      return story()
    },
  ],
  globalTypes: {
    theme: {
      description: 'Component library theme',
      toolbar: {
        icon: 'paintbrush',
        items: ['default', 'aqua'],
      },
    },
  },
  initialGlobals: {
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
