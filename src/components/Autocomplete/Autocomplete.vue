<script setup lang="ts">
import { computed, nextTick, ref, useId } from 'vue'
import {
  AutocompleteAnchor,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompletePortal,
  AutocompleteRoot,
  AutocompleteViewport,
  AutocompleteVirtualizer,
} from 'reka-ui'

import type { AutocompleteSuggestion } from '../../types'

const model = defineModel<string>({ default: '' })
const open = defineModel<boolean>('open', { default: false })
const props = withDefaults(
  defineProps<{
    id?: string
    suggestions: AutocompleteSuggestion[]
    label?: string
    help?: string
    error?: string
    placeholder?: string
    emptyText?: string
    name?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    openOnFocus?: boolean
    openOnClick?: boolean
    virtualize?: boolean
    estimateSize?: number
    overscan?: number
    filter?: (suggestion: AutocompleteSuggestion, term: string) => boolean
  }>(),
  {
    placeholder: 'Start typing…',
    emptyText: 'No suggestions found.',
    required: false,
    disabled: false,
    readonly: false,
    clearable: true,
    openOnFocus: true,
    openOnClick: true,
    virtualize: false,
    estimateSize: 40,
    overscan: 8,
    filter: undefined,
  },
)
const emit = defineEmits<{ select: [suggestion: AutocompleteSuggestion]; clear: [] }>()
const inputRef = ref<HTMLElement | { $el?: HTMLElement } | null>(null)

const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const labelId = computed(() => `${inputId.value}-label`)
const descriptionId = computed(() =>
  props.help || props.error ? `${inputId.value}-description` : undefined,
)
const filteredSuggestions = computed(() => {
  const term = model.value.trim().toLocaleLowerCase()
  return props.suggestions.filter((suggestion) => {
    if (props.filter) return props.filter(suggestion, model.value)
    if (!term) return true
    return [suggestion.label, suggestion.description, ...(suggestion.keywords ?? [])]
      .filter(Boolean)
      .some((candidate) => candidate!.toLocaleLowerCase().includes(term))
  })
})

function clear() {
  model.value = ''
  open.value = false
  emit('clear')
}

function selectSuggestion(suggestion: AutocompleteSuggestion) {
  emit('select', suggestion)
  nextTick(() => {
    setTimeout(() => {
      const target = inputRef.value
      const input = target instanceof HTMLElement ? target : target?.$el
      input?.removeAttribute('aria-activedescendant')
    }, 0)
  })
}
</script>

<template>
  <div class="clv-autocomplete-field">
    <label v-if="label" :id="labelId" class="clv-autocomplete-field__label" :for="inputId">
      {{ label }}
    </label>
    <AutocompleteRoot
      v-model="model"
      v-model:open="open"
      :name="name"
      :required="required"
      :disabled="disabled || readonly"
      :open-on-focus="openOnFocus"
      :open-on-click="openOnClick"
      :ignore-filter="true"
    >
      <AutocompleteAnchor class="clv-autocomplete">
        <AutocompleteInput
          ref="inputRef"
          :id="inputId"
          class="clv-autocomplete__input"
          :placeholder="placeholder"
          :aria-labelledby="label ? labelId : undefined"
          :aria-describedby="descriptionId"
          :aria-invalid="error ? 'true' : undefined"
          :readonly="readonly"
        />
        <button
          v-if="clearable && model"
          class="clv-autocomplete__clear"
          type="button"
          aria-label="Clear value"
          :disabled="disabled || readonly"
          @click="clear"
        >
          ×
        </button>
      </AutocompleteAnchor>
      <AutocompletePortal>
        <AutocompleteContent class="clv-autocomplete-content" position="popper" :side-offset="6">
          <AutocompleteEmpty
            v-if="filteredSuggestions.length === 0"
            class="clv-autocomplete-content__empty"
          >
            {{ emptyText }}
          </AutocompleteEmpty>
          <AutocompleteViewport v-else class="clv-autocomplete-content__viewport">
            <AutocompleteVirtualizer
              v-if="virtualize"
              :options="filteredSuggestions"
              :estimate-size="estimateSize"
              :overscan="overscan"
              :text-content="(suggestion) => suggestion.label"
            >
              <template #default="{ option: suggestion }">
                <AutocompleteItem
                  class="clv-autocomplete-content__item"
                  :value="suggestion.label"
                  :disabled="suggestion.disabled"
                  @select="selectSuggestion(suggestion)"
                >
                  <slot name="option" :suggestion="suggestion">
                    <span>{{ suggestion.label }}</span>
                    <small v-if="suggestion.description">{{ suggestion.description }}</small>
                  </slot>
                </AutocompleteItem>
              </template>
            </AutocompleteVirtualizer>
            <AutocompleteItem
              v-for="suggestion in virtualize ? [] : filteredSuggestions"
              :key="suggestion.value"
              class="clv-autocomplete-content__item"
              :value="suggestion.label"
              :disabled="suggestion.disabled"
              @select="selectSuggestion(suggestion)"
            >
              <slot name="option" :suggestion="suggestion">
                <span>{{ suggestion.label }}</span>
                <small v-if="suggestion.description">{{ suggestion.description }}</small>
              </slot>
            </AutocompleteItem>
          </AutocompleteViewport>
        </AutocompleteContent>
      </AutocompletePortal>
    </AutocompleteRoot>
    <span
      v-if="help || error"
      :id="descriptionId"
      :class="{ 'clv-autocomplete-field__error': error }"
    >
      {{ error ?? help }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

.clv-autocomplete-field {
  @include field-stack;

  &__label {
    @include field-label;
  }
  &__error {
    color: var(--clv-color-danger);
  }
}

.clv-autocomplete {
  @include field;
  display: flex;
  align-items: center;

  &:focus-within {
    @include focus-ring;
  }

  &__input {
    width: 100%;
    min-width: 0;
    padding: 0.65rem 0.8rem;
    border: 0;
    outline: 0;
    background: transparent;
    color: inherit;
    font: inherit;
  }

  &__clear {
    margin-right: var(--clv-space-2);
    border: 0;
    background: transparent;
    color: var(--clv-color-text-muted);
    cursor: pointer;
    font-size: 1.25rem;
  }
}

.clv-autocomplete-content {
  @include floating-surface;
  z-index: 1100;
  width: var(--reka-combobox-trigger-width);
  max-height: min(20rem, var(--reka-combobox-content-available-height));
  overflow: hidden;
  font-family: var(--clv-font-sans);

  &__viewport {
    max-height: 20rem;
    padding: var(--clv-space-1);
    overflow: auto;
  }
  &__empty {
    padding: var(--clv-space-4);
    color: var(--clv-color-text-muted);
  }
  &__item {
    @include menu-item;
    display: grid;
    small {
      color: var(--clv-color-text-muted);
    }
  }
}
</style>
