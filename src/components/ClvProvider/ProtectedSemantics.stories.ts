import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import type { ButtonParts, InputParts, ListboxParts } from '../../parts'
import type { ChoiceOption, ClvValue } from '../../types'
import Button from '../Button/Button.vue'
import Input from '../Input/Input.vue'
import Listbox from '../Listbox/Listbox.vue'

const meta = {
  title: 'Foundation/Protected semantics',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const AuthoritativeAttributesAndEventOrder: Story = {
  render: () => ({
    components: { Button, Input, Listbox },
    setup() {
      const lockedValue = ref('authoritative value')
      const liveValue = ref('')
      const inputOrder = ref<string[]>([])
      const buttonOrder = ref<string[]>([])
      const selectedValue = ref<ClvValue>('one')
      const rogueModelUpdates = ref(0)
      const options: ChoiceOption[] = [
        { label: 'One', value: 'one' },
        { label: 'Two', value: 'two' },
      ]

      const lockedInputParts: InputParts = {
        input: {
          id: 'rogue-input',
          role: 'switch',
          value: 'rogue value',
          disabled: false,
          readonly: false,
          required: false,
          'aria-invalid': 'false',
          'aria-describedby': 'rogue-description',
          autocomplete: 'off',
          'data-testid': 'locked-input',
        },
      }
      const liveInputParts: InputParts = {
        input: {
          id: 'rogue-generated-input',
          'aria-describedby': 'external-description',
          onInput: () => inputOrder.value.push(liveValue.value),
          'data-testid': 'live-input',
        },
      }
      const disabledButtonParts: ButtonParts = {
        root: {
          as: 'a',
          type: 'submit',
          disabled: false,
          role: 'link',
          href: '#rogue',
          'aria-disabled': 'false',
          'data-testid': 'disabled-button',
        },
      }
      const liveButtonParts: ButtonParts = {
        root: {
          onClick: () => buttonOrder.value.push('part'),
        },
      }
      const listboxParts: ListboxParts = {
        control: {
          id: 'rogue-listbox',
          modelValue: 'rogue',
          name: 'rogue-name',
          required: false,
          disabled: true,
          multiple: true,
          role: 'tree',
          'onUpdate:modelValue': () => {
            rogueModelUpdates.value += 1
          },
        },
        content: {
          'aria-labelledby': 'rogue-label',
          'aria-describedby': 'rogue-description',
        },
        item: {
          value: 'rogue-option',
          disabled: true,
          role: 'treeitem',
        },
      }

      return {
        buttonOrder,
        disabledButtonParts,
        inputOrder,
        listboxParts,
        liveButtonParts,
        liveInputParts,
        liveValue,
        lockedInputParts,
        lockedValue,
        options,
        rogueModelUpdates,
        selectedValue,
      }
    },
    template: `
      <div>
        <Input
          id="protected-input"
          v-model="lockedValue"
          label="Locked field"
          help="Authoritative description"
          disabled
          readonly
          required
          :parts="lockedInputParts"
        />

        <span id="external-description">External description</span>
        <Input
          v-model="liveValue"
          label="Live field"
          :parts="liveInputParts"
        />
        <output data-testid="input-order">{{ inputOrder.join('|') }}</output>

        <Button disabled :parts="disabledButtonParts">Disabled action</Button>
        <Button
          :parts="liveButtonParts"
          @click="buttonOrder.push('component')"
        >Ordered action</Button>
        <output data-testid="button-order">{{ buttonOrder.join('|') }}</output>

        <Listbox
          id="protected-listbox"
          v-model="selectedValue"
          :options="options"
          label="Protected options"
          help="Choose one option"
          name="protected-choice"
          required
          :parts="listboxParts"
        />
        <output data-testid="selected-value">{{ selectedValue }}</output>
        <output data-testid="rogue-updates">{{ rogueModelUpdates }}</output>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const lockedInput = canvas.getByTestId('locked-input')
    await expect(lockedInput).toHaveAttribute('id', 'protected-input')
    await expect(lockedInput).not.toHaveAttribute('role')
    await expect(lockedInput).toHaveValue('authoritative value')
    await expect(lockedInput).toBeDisabled()
    await expect(lockedInput).toHaveAttribute('readonly')
    await expect(lockedInput).toBeRequired()
    await expect(lockedInput).toHaveAttribute('aria-describedby', 'protected-input-description')
    await expect(lockedInput).toHaveAttribute('autocomplete', 'off')

    const liveInput = canvas.getByTestId('live-input')
    await expect(liveInput).toHaveAttribute('id')
    await expect(liveInput).not.toHaveAttribute('id', 'rogue-generated-input')
    await expect(canvas.getByText('Live field')).toHaveAttribute('for', liveInput.id)
    await expect(liveInput).toHaveAttribute('aria-describedby', 'external-description')
    await expect(liveInput).toHaveAccessibleDescription('External description')
    await userEvent.type(liveInput, 'ab')
    await expect(liveInput).toHaveValue('ab')
    await expect(canvas.getByTestId('input-order')).toHaveTextContent('a|ab')

    const disabledButton = canvas.getByTestId('disabled-button')
    await expect(disabledButton.tagName).toBe('BUTTON')
    await expect(disabledButton).toHaveAttribute('type', 'button')
    await expect(disabledButton).toBeDisabled()
    await expect(disabledButton).not.toHaveAttribute('role')
    await expect(disabledButton).not.toHaveAttribute('href')

    await userEvent.click(canvas.getByRole('button', { name: 'Ordered action' }))
    await expect(canvas.getByTestId('button-order')).toHaveTextContent('component|part')

    const listbox = canvas.getByRole('listbox', { name: 'Protected options' })
    await expect(listbox).not.toHaveAttribute('role', 'tree')
    await expect(listbox).toHaveAttribute('aria-labelledby', 'protected-listbox-label')
    await expect(listbox).toHaveAttribute('aria-describedby', 'protected-listbox-description')
    await userEvent.click(canvas.getByRole('option', { name: 'Two' }))
    await expect(canvas.getByTestId('selected-value')).toHaveTextContent('two')
    await expect(canvas.getByTestId('rogue-updates')).toHaveTextContent('0')

    await expect(canvasElement.querySelector('[name="rogue-name"]')).not.toBeInTheDocument()
  },
}
