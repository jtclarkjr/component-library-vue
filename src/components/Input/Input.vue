<script setup lang="ts">
import { computed, toRef, useAttrs, useId, useSlots } from 'vue'

import { useClvComponent } from '../../headless'
import type { InputPartContext, InputParts } from '../../parts'
import type { InputType } from '../../types'

defineOptions({ inheritAttrs: false })

const model = defineModel<string>({ default: '' })
const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    help?: string
    error?: string
    type?: InputType
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    clearable?: boolean
    clearLabel?: string
    unstyled?: boolean
    parts?: InputParts
  }>(),
  {
    type: 'text',
    disabled: false,
    readonly: false,
    required: false,
    clearable: false,
    clearLabel: 'Clear input',
    unstyled: undefined,
    parts: undefined,
  },
)

const emit = defineEmits<{
  clear: []
}>()

const attrs = useAttrs()
const slots = useSlots()
const clv = useClvComponent<InputPartContext>('input', {
  attrs,
  parts: toRef(props, 'parts'),
  unstyled: toRef(props, 'unstyled'),
})
const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() =>
  props.help || props.error ? `${inputId.value}-description` : undefined,
)
const accessibleLabel = computed(() =>
  typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : undefined,
)
const canClear = computed(
  () => props.clearable && model.value.length > 0 && !props.disabled && !props.readonly,
)
const hasControl = computed(() => Boolean(slots.leading || slots.trailing || props.clearable))
const context = computed(() => ({
  disabled: props.disabled,
  invalid: Boolean(props.error),
  readonly: props.readonly,
  value: model.value,
}))

function updateModel(event: Event) {
  model.value = (event.target as HTMLInputElement).value
}

function clear() {
  if (!canClear.value) return
  model.value = ''
  emit('clear')
}

const rootAttrs = computed(() =>
  clv.part('root', context.value, {
    class: 'clv-input',
    'data-disabled': props.disabled ? '' : undefined,
    'data-invalid': props.error ? '' : undefined,
    'data-readonly': props.readonly ? '' : undefined,
  }),
)
const labelAttrs = computed(() =>
  clv.part(
    'label',
    context.value,
    { class: props.label ? 'clv-input__label' : 'clv-input__sr-only', for: inputId.value },
    { protected: ['for'] },
  ),
)
const controlAttrs = computed(() =>
  clv.part('control', context.value, { class: 'clv-input__control' }),
)
const inputAttrs = computed(() =>
  clv.part(
    'input',
    context.value,
    {
      id: inputId.value,
      class: [
        'clv-input__field',
        slots.leading && 'clv-input__field--leading',
        (slots.trailing || canClear.value) && 'clv-input__field--trailing',
      ],
      type: props.type,
      value: model.value,
      placeholder: props.placeholder,
      disabled: props.disabled,
      readonly: props.readonly,
      required: props.required,
      'aria-invalid': props.error ? 'true' : undefined,
      'aria-describedby': descriptionId.value,
      onInput: updateModel,
    },
    {
      protected: [
        'id',
        'type',
        'value',
        'disabled',
        'readonly',
        'required',
        'aria-invalid',
        'aria-describedby',
      ],
    },
  ),
)
const descriptionAttrs = computed(() =>
  clv.part(
    'description',
    context.value,
    {
      id: descriptionId.value,
      class: ['clv-input__description', props.error && 'clv-input__error'],
    },
    { protected: ['id'] },
  ),
)
</script>

<template>
  <div v-bind="rootAttrs">
    <label v-if="label || accessibleLabel" v-bind="labelAttrs">
      {{ label ?? accessibleLabel }}
    </label>
    <span v-if="hasControl" v-bind="controlAttrs">
      <span
        v-if="$slots.leading"
        v-bind="clv.part('leading', context, { class: 'clv-input__leading' })"
      >
        <slot name="leading" :context="clv.slotContext('leading', context)" />
      </span>
      <input v-bind="inputAttrs" />
      <span
        v-if="$slots.trailing || canClear"
        v-bind="clv.part('trailing', context, { class: 'clv-input__trailing' })"
      >
        <slot name="trailing" :context="clv.slotContext('trailing', context)" />
        <button
          v-if="canClear"
          v-bind="
            clv.part(
              'clear',
              context,
              {
                class: 'clv-input__clear',
                type: 'button',
                'aria-label': clearLabel,
                onClick: clear,
              },
              { protected: ['type', 'aria-label'] },
            )
          "
        >
          <slot name="clear-icon" :context="clv.slotContext('clear', context)">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </slot>
        </button>
      </span>
    </span>
    <input v-else v-bind="inputAttrs" />
    <span v-if="help || error" v-bind="descriptionAttrs">{{ error ?? help }}</span>
  </div>
</template>

<style scoped lang="scss">
@layer clv.components {
  .clv-input {
    display: grid;
    width: 100%;
    gap: var(--clv-input-gap);
    color: var(--clv-color-text-muted);
    font-family: var(--clv-font-sans);
    font-size: var(--clv-font-size-body-sm);

    &__label {
      color: var(--clv-color-text);
      font-weight: var(--clv-input-label-weight);
    }

    &__sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    &__control {
      position: relative;
      display: block;
      width: 100%;
    }

    &__field {
      display: block;
      width: 100%;
      min-height: var(--clv-input-height);
      padding: var(--clv-input-padding);
      border: var(--clv-input-border-width) solid var(--clv-color-border);
      border-radius: var(--clv-input-radius);
      background: var(--clv-input-bg);
      color: var(--clv-color-text);
      font: inherit;
      font-size: var(--clv-input-font-size);
      transition: border-color var(--clv-motion-fast) var(--clv-motion-easing-standard);

      &:focus-visible {
        border-color: var(--clv-color-primary);
        outline: var(--clv-input-focus-width) solid var(--clv-color-focus);
      }

      &::placeholder {
        color: var(--clv-color-text-muted);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }

      &[type='search']::-webkit-search-cancel-button,
      &[type='search']::-webkit-search-decoration {
        appearance: none;
      }

      &--leading {
        padding-left: var(--clv-input-leading-padding);
      }

      &--trailing {
        padding-right: var(--clv-input-trailing-padding);
      }
    }

    &__leading,
    &__trailing {
      position: absolute;
      top: 50%;
      z-index: var(--clv-z-local);
      display: inline-flex;
      align-items: center;
      transform: translateY(-50%);
    }

    &__leading {
      left: var(--clv-input-affix-offset);
    }

    &__trailing {
      right: var(--clv-input-affix-offset);
    }

    &__clear {
      display: inline-flex;
      width: 1.5rem;
      height: 1.5rem;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--clv-color-text-muted);
      cursor: pointer;

      &:focus-visible {
        border-radius: var(--clv-radius-round);
        outline: var(--clv-focus-ring-width) solid var(--clv-color-focus);
      }

      svg {
        width: 1rem;
        height: 1rem;
      }
    }

    &__description {
      color: var(--clv-color-text-muted);
      font-size: var(--clv-font-size-sm);
    }

    &__error {
      color: var(--clv-color-danger);
    }
  }
}
</style>
