import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, waitFor, within } from 'storybook/test'
import { nextTick, onMounted, ref } from 'vue'

import ClvProvider from '../components/ClvProvider/ClvProvider.vue'
import type { ClvThemePalette } from '../themes'
import './Colors.stories.scss'

type ColorGroup = 'Surfaces' | 'Content and actions' | 'Feedback' | 'Utility'

type ColorDocumentation = {
  description: string
  group: ColorGroup
  label: string
}

const colorDocumentation = {
  bg: { label: 'Background', description: 'Page and application background', group: 'Surfaces' },
  surface: { label: 'Surface', description: 'Default component surface', group: 'Surfaces' },
  surfaceRaised: {
    label: 'Raised surface',
    description: 'Elevated and floating component surface',
    group: 'Surfaces',
  },
  border: { label: 'Border', description: 'Default dividers and outlines', group: 'Surfaces' },
  text: { label: 'Text', description: 'Primary content and labels', group: 'Content and actions' },
  textMuted: {
    label: 'Muted text',
    description: 'Secondary and supporting content',
    group: 'Content and actions',
  },
  primary: {
    label: 'Primary',
    description: 'Primary actions and selected states',
    group: 'Content and actions',
  },
  onPrimary: {
    label: 'On primary',
    description: 'Content placed on the primary color',
    group: 'Content and actions',
  },
  primaryHover: {
    label: 'Primary hover',
    description: 'Primary action hover state',
    group: 'Content and actions',
  },
  primaryStrong: {
    label: 'Primary strong',
    description: 'Emphasized primary accents',
    group: 'Content and actions',
  },
  danger: { label: 'Danger', description: 'Destructive and error states', group: 'Feedback' },
  onDanger: {
    label: 'On danger',
    description: 'Content placed on the danger color',
    group: 'Feedback',
  },
  dangerHover: {
    label: 'Danger hover',
    description: 'Destructive action hover state',
    group: 'Feedback',
  },
  success: { label: 'Success', description: 'Successful outcomes', group: 'Feedback' },
  warning: { label: 'Warning', description: 'Caution and warning states', group: 'Feedback' },
  info: { label: 'Information', description: 'Informational states', group: 'Feedback' },
  selection: {
    label: 'Selection',
    description: 'Selected and highlighted backgrounds',
    group: 'Utility',
  },
  checkerA: {
    label: 'Checker A',
    description: 'First transparency checker color',
    group: 'Utility',
  },
  checkerB: {
    label: 'Checker B',
    description: 'Second transparency checker color',
    group: 'Utility',
  },
  focus: { label: 'Focus', description: 'Keyboard focus indication', group: 'Utility' },
  overlay: { label: 'Overlay', description: 'Modal and drawer backdrops', group: 'Utility' },
  controlOutline: {
    label: 'Control outline',
    description: 'Outline for color controls',
    group: 'Utility',
  },
  controlHandleBorder: {
    label: 'Control handle border',
    description: 'Border around draggable color handles',
    group: 'Utility',
  },
} satisfies Record<keyof ClvThemePalette, ColorDocumentation>

const groupOrder: readonly ColorGroup[] = ['Surfaces', 'Content and actions', 'Feedback', 'Utility']

function toColorToken(key: string): `--clv-color-${string}` {
  return `--clv-color-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

const colorGroups = groupOrder.map((name) => ({
  name,
  tokens: Object.entries(colorDocumentation)
    .filter(([, documentation]) => documentation.group === name)
    .map(([key, documentation]) => ({
      ...documentation,
      key,
      variable: toColorToken(key),
    })),
}))

const palettes = [
  { id: 'default', label: 'Default', theme: 'default', mode: undefined },
  { id: 'aqua', label: 'Aqua', theme: 'aqua', mode: undefined },
  { id: 'neutral-dark', label: 'Neutral Dark', theme: 'neutral', mode: 'dark' },
  { id: 'neutral-light', label: 'Neutral Light', theme: 'neutral', mode: 'light' },
] as const

const meta = {
  title: 'Foundation/Colors',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ThemePalettes: Story = {
  render: () => ({
    components: { ClvProvider },
    setup() {
      const resolvedValues = ref<Record<string, Record<string, string>>>({})

      onMounted(async () => {
        await nextTick()

        resolvedValues.value = Object.fromEntries(
          palettes.map((palette) => {
            const element = document.querySelector<HTMLElement>(
              `[data-testid="palette-${palette.id}"]`,
            )
            if (element === null) return [palette.id, {}]

            const style = getComputedStyle(element)
            return [
              palette.id,
              Object.fromEntries(
                colorGroups.flatMap((group) =>
                  group.tokens.map((token) => [
                    token.variable,
                    style.getPropertyValue(token.variable).trim(),
                  ]),
                ),
              ),
            ]
          }),
        )
      })

      return { colorGroups, palettes, resolvedValues }
    },
    template: `
      <main class="clv-color-reference">
        <header class="clv-color-reference__header">
          <p class="clv-color-reference__eyebrow">Foundation</p>
          <h1>Semantic colors</h1>
          <p>
            Compare the public color roles across every built-in theme. Values are resolved from
            the same CSS custom properties consumed by the components.
          </p>
        </header>

        <div
          aria-label="Theme palette comparison"
          class="clv-color-reference__grid"
          tabindex="0"
        >
          <ClvProvider
            v-for="palette in palettes"
            :key="palette.id"
            :data-testid="'palette-' + palette.id"
            :theme="palette.theme"
            :mode="palette.mode"
            class="clv-color-reference__palette"
          >
            <header class="clv-color-reference__palette-header">
              <h2>{{ palette.label }}</h2>
              <code>{{ palette.theme }}<template v-if="palette.mode"> / {{ palette.mode }}</template></code>
            </header>

            <section v-for="group in colorGroups" :key="group.name">
              <h3>{{ group.name }}</h3>
              <ul>
                <li
                  v-for="token in group.tokens"
                  :key="token.key"
                  :data-token-key="token.key"
                  class="clv-color-reference__token"
                >
                  <span class="clv-color-reference__swatch-backdrop" aria-hidden="true">
                    <span
                      class="clv-color-reference__swatch"
                      :style="{ backgroundColor: 'var(' + token.variable + ')' }"
                    />
                  </span>
                  <span class="clv-color-reference__token-copy">
                    <strong>{{ token.label }}</strong>
                    <span>{{ token.description }}</span>
                    <code>{{ token.variable }}</code>
                    <code
                      :data-testid="'token-value-' + palette.id + '-' + token.key"
                      class="clv-color-reference__value"
                    >{{ resolvedValues[palette.id]?.[token.variable] || 'Resolving…' }}</code>
                  </span>
                </li>
              </ul>
            </section>
          </ClvProvider>
        </div>
      </main>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const allTokens = colorGroups.flatMap((group) => group.tokens)

    await waitFor(async () => {
      await Promise.all(
        palettes.flatMap((palette) =>
          allTokens.map((token) =>
            expect(
              canvas.getByTestId(`token-value-${palette.id}-${token.key}`),
            ).not.toHaveTextContent('Resolving…'),
          ),
        ),
      )
    })

    for (const palette of palettes) {
      const panel = canvas.getByTestId(`palette-${palette.id}`)
      const panelStyle = getComputedStyle(panel)
      await expect(panel).toHaveAttribute('data-clv-theme', palette.theme)

      if (palette.mode === undefined) {
        await expect(panel).not.toHaveAttribute('data-clv-theme-mode')
      } else {
        await expect(panel).toHaveAttribute('data-clv-theme-mode', palette.mode)
      }

      await expect(panel.querySelectorAll('[data-token-key]')).toHaveLength(allTokens.length)

      for (const token of allTokens) {
        const expectedValue = panelStyle.getPropertyValue(token.variable).trim()
        await expect(expectedValue).not.toBe('')
        const displayedValue =
          canvas.getByTestId(`token-value-${palette.id}-${token.key}`).textContent ?? ''
        await expect(normalizeWhitespace(displayedValue)).toBe(normalizeWhitespace(expectedValue))
      }
    }

    const value = (palette: (typeof palettes)[number]['id'], token: keyof ClvThemePalette) =>
      canvas.getByTestId(`token-value-${palette}-${token}`).textContent

    await expect(value('default', 'primary')).not.toBe(value('aqua', 'primary'))
    await expect(value('neutral-dark', 'bg')).not.toBe(value('neutral-light', 'bg'))
  },
}
