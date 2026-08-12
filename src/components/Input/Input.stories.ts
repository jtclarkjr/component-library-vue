import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import type { ClvInputAttrs, InputParts } from '../../parts'
import Input from './Input.vue'

const meta = {
  title: 'Components/Input',
  component: Input,
  args: {
    label: 'Email address',
    help: 'We will only use this for account notifications.',
    placeholder: 'you@example.com',
    type: 'email',
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Email address' })
    await userEvent.type(input, 'hello@example.com')
    await expect(input).toHaveValue('hello@example.com')
    await expect(input).toHaveAccessibleDescription(
      'We will only use this for account notifications.',
    )
  },
}

export const Invalid: Story = {
  args: {
    help: undefined,
    error: 'Enter a valid email address.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Email address' })
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAccessibleDescription('Enter a valid email address.')
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Clearable: Story = {
  args: { label: 'Search', type: 'search', clearable: true, onClear: fn() },
  render: (args) => ({
    components: { Input },
    setup() {
      const value = ref('Frieren')
      return { args, value }
    },
    template: `
      <Input v-model="value" v-bind="args">
        <template #leading>⌕</template>
      </Input>
    `,
  }),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('searchbox', { name: 'Search' })
    await expect(input).toHaveValue('Frieren')
    await userEvent.click(canvas.getByRole('button', { name: 'Clear input' }))
    await expect(input).toHaveValue('')
    await expect(args.onClear).toHaveBeenCalledOnce()
  },
}

export const ProgressiveCustomization: Story = {
  render: () => ({
    components: { Input },
    setup() {
      const value = ref('')
      const eventOrder = ref<string[]>([])
      const inputAttrs: ClvInputAttrs = {
        autocomplete: 'email',
        class: 'search-input',
        style: { letterSpacing: '1px' },
        id: 'rogue-input',
        role: 'switch',
        type: 'email',
        value: 'rogue value',
        disabled: true,
        readonly: true,
        required: true,
        'aria-invalid': 'false',
        'aria-describedby': 'rogue-description',
        'aria-keyshortcuts': 'Control+K',
        'data-precedence': 'attrs',
        'data-testid': 'progressive-input',
        onInput: () => eventOrder.value.push(`attrs:${value.value}`),
      }
      const parts: InputParts = {
        input: {
          autocomplete: 'off',
          class: 'advanced-input',
          style: { textTransform: 'lowercase' },
          'data-precedence': 'parts',
          onInput: () => eventOrder.value.push(`parts:${value.value}`),
        },
      }

      return { eventOrder, inputAttrs, parts, value }
    },
    template: `
      <div>
        <Input
          v-model="value"
          label="Search"
          error="Enter a search term"
          class="search-field"
          data-testid="progressive-root"
          :input-attrs="inputAttrs"
          :parts="parts"
        />
        <output data-testid="progressive-order">{{ eventOrder.join('|') }}</output>

        <Input
          label="Headless search"
          unstyled
          class="headless-root"
          :input-attrs="{ class: 'headless-input', 'data-testid': 'headless-input' }"
        />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const root = canvas.getByTestId('progressive-root')
    const input = canvas.getByTestId('progressive-input')

    await expect(root).toHaveClass('clv-input', 'search-field')
    await expect(input).toHaveClass('clv-input__field', 'search-input', 'advanced-input')
    await expect(input).toHaveStyle({ letterSpacing: '1px', textTransform: 'lowercase' })
    await expect(input).toHaveAttribute('autocomplete', 'off')
    await expect(input).not.toHaveAttribute('id', 'rogue-input')
    await expect(input).not.toHaveAttribute('role')
    await expect(input).toHaveAttribute('type', 'text')
    await expect(input).toHaveValue('')
    await expect(input).not.toBeDisabled()
    await expect(input).not.toHaveAttribute('readonly')
    await expect(input).not.toBeRequired()
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).not.toHaveAttribute('aria-describedby', 'rogue-description')
    await expect(input).toHaveAttribute('aria-keyshortcuts', 'Control+K')
    await expect(input).toHaveAttribute('data-precedence', 'parts')

    await userEvent.type(input, 'A')
    await expect(input).toHaveValue('A')
    await expect(canvas.getByTestId('progressive-order')).toHaveTextContent('attrs:A|parts:A')

    const headlessRoot = canvas.getByText('Headless search').closest('[data-part="root"]')
    const headlessInput = canvas.getByTestId('headless-input')
    await expect(headlessRoot).toHaveClass('headless-root')
    await expect(headlessRoot).not.toHaveClass('clv-input')
    await expect(headlessInput).toHaveClass('headless-input')
    await expect(headlessInput).not.toHaveClass('clv-input__field')
  },
}

export const VisualDefault: Story = {
  ...Default,
  tags: ['visual', '!autodocs'],
  play: undefined,
}

export const VisualInvalid: Story = {
  ...Invalid,
  tags: ['visual', '!autodocs'],
  play: undefined,
}

export const VisualDisabled: Story = {
  ...Disabled,
  tags: ['visual', '!autodocs'],
  play: undefined,
}

export const VisualClearable: Story = {
  ...Clearable,
  tags: ['visual', '!autodocs'],
  play: undefined,
}

export const VisualHover: Story = {
  ...Default,
  tags: ['visual', '!autodocs'],
  play: async ({ canvasElement }) => {
    await userEvent.hover(within(canvasElement).getByRole('textbox', { name: 'Email address' }))
  },
}

export const VisualFocus: Story = {
  ...Default,
  tags: ['visual', '!autodocs'],
  play: async ({ canvasElement }) => {
    within(canvasElement).getByRole('textbox', { name: 'Email address' }).focus()
  },
}
