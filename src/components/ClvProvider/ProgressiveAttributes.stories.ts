import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'

import type { ClvButtonAttrs, ClvInputAttrs } from '../../parts'
import Autocomplete from '../Autocomplete/Autocomplete.vue'
import Checkbox from '../Checkbox/Checkbox.vue'
import Collapsible from '../Collapsible/Collapsible.vue'
import ColorField from '../ColorField/ColorField.vue'
import Combobox from '../Combobox/Combobox.vue'
import DatePicker from '../DatePicker/DatePicker.vue'
import DateRangePicker from '../DateRangePicker/DateRangePicker.vue'
import Editable from '../Editable/Editable.vue'
import NumberField from '../NumberField/NumberField.vue'
import Select from '../Select/Select.vue'
import Switch from '../Switch/Switch.vue'
import TagsInput from '../TagsInput/TagsInput.vue'

const meta = {
  title: 'Foundation/Progressive attributes',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function inputAttrs(testId: string): ClvInputAttrs {
  return {
    autocomplete: 'off',
    'aria-keyshortcuts': 'Control+K',
    'data-testid': testId,
  }
}

function buttonAttrs(testId: string): ClvButtonAttrs {
  return {
    'aria-keyshortcuts': 'Enter',
    'data-testid': testId,
  }
}

export const NamedInteractiveTargets: Story = {
  render: () => ({
    components: {
      Autocomplete,
      Checkbox,
      Collapsible,
      ColorField,
      Combobox,
      DatePicker,
      DateRangePicker,
      Editable,
      NumberField,
      Select,
      Switch,
      TagsInput,
    },
    setup() {
      const options = [{ label: 'One', value: 'one' }]
      const suggestions = [{ label: 'Alpha', value: 'alpha' }]
      const triggerEvents = ref(0)

      return { buttonAttrs, inputAttrs, options, suggestions, triggerEvents }
    },
    template: `
      <div style="display: grid; gap: 1rem">
        <Autocomplete
          label="Autocomplete"
          :suggestions="suggestions"
          :input-attrs="inputAttrs('autocomplete-input')"
        />
        <Combobox
          label="Combobox"
          :options="options"
          :input-attrs="inputAttrs('combobox-input')"
          :trigger-attrs="buttonAttrs('combobox-trigger')"
        />
        <ColorField :input-attrs="inputAttrs('color-field-input')" />
        <Editable
          label="Editable"
          start-with-edit-mode
          :input-attrs="inputAttrs('editable-input')"
        />
        <NumberField label="Number" :input-attrs="inputAttrs('number-field-input')" />
        <TagsInput label="Tags" :input-attrs="inputAttrs('tags-input')" />

        <Checkbox label="Checkbox" :control-attrs="buttonAttrs('checkbox-control')" />
        <Switch label="Switch" :control-attrs="buttonAttrs('switch-control')" />

        <Collapsible
          title="Collapsible"
          :trigger-attrs="{
            ...buttonAttrs('collapsible-trigger'),
            onClick: () => triggerEvents++,
          }"
        >
          Content
        </Collapsible>
        <output data-testid="trigger-events">{{ triggerEvents }}</output>
        <Select
          label="Select"
          :options="options"
          :trigger-attrs="buttonAttrs('select-trigger')"
        />
        <DatePicker :trigger-attrs="buttonAttrs('date-picker-trigger')" />
        <DateRangePicker :trigger-attrs="buttonAttrs('date-range-picker-trigger')" />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const inputIds = [
      'autocomplete-input',
      'combobox-input',
      'color-field-input',
      'editable-input',
      'number-field-input',
      'tags-input',
    ]
    const buttonIds = [
      'combobox-trigger',
      'checkbox-control',
      'switch-control',
      'collapsible-trigger',
      'select-trigger',
      'date-picker-trigger',
      'date-range-picker-trigger',
    ]

    for (const testId of inputIds) {
      const target = canvas.getByTestId(testId)
      await expect(target).toHaveAttribute('autocomplete', 'off')
      await expect(target).toHaveAttribute('aria-keyshortcuts', 'Control+K')
    }
    for (const testId of buttonIds) {
      await expect(canvas.getByTestId(testId)).toHaveAttribute('aria-keyshortcuts', 'Enter')
    }

    await userEvent.click(canvas.getByTestId('collapsible-trigger'))
    await expect(canvas.getByTestId('trigger-events')).toHaveTextContent('1')
  },
}
