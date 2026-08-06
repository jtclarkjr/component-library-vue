<script setup lang="ts">
import { computed } from 'vue'
import {
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperRoot,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from 'reka-ui'

import type { StepperStep } from '../../types'
import { useClvComponent } from '../../headless'
import type { StepperPartContext, StepperParts } from '../../parts'

const model = defineModel<number>({ default: 1 })
const props = withDefaults(
  defineProps<{
    steps: StepperStep[]
    linear?: boolean
    orientation?: 'horizontal' | 'vertical'
    label?: string
    unstyled?: boolean
    parts?: StepperParts
  }>(),
  { linear: true, orientation: 'horizontal', label: 'Progress' },
)
const { classes, part, slotContext } = useClvComponent<StepperPartContext>('stepper', props)
const activeStep = computed(() => props.steps.find((step) => step.value === model.value))
</script>

<template>
  <StepperRoot
    v-slot="controls"
    v-model="model"
    :class="classes('clv-stepper')"
    :linear="linear"
    :orientation="orientation"
    :aria-label="label"
    v-bind="part('root', { orientation, value: model })"
  >
    <div :class="classes('clv-stepper__list')" v-bind="part('list', { orientation, value: model })">
      <StepperItem
        v-for="(step, index) in steps"
        :key="step.value"
        v-slot="{ state }"
        :class="classes('clv-stepper__item')"
        :step="step.value"
        :disabled="step.disabled"
        :completed="step.completed"
        v-bind="
          part('item', {
            item: step,
            index,
            value: step.value,
            disabled: step.disabled,
            orientation,
          })
        "
      >
        <StepperTrigger
          :class="classes('clv-stepper__trigger')"
          v-bind="
            part('trigger', {
              item: step,
              index,
              value: step.value,
              disabled: step.disabled,
              orientation,
            })
          "
        >
          <StepperIndicator
            :class="classes('clv-stepper__indicator')"
            v-bind="
              part('indicator', {
                item: step,
                index,
                value: step.value,
                disabled: step.disabled,
                orientation,
              })
            "
          >
            <slot
              name="indicator"
              :step="step"
              :state="state"
              :context="
                slotContext('indicator', {
                  item: step,
                  index,
                  value: step.value,
                  disabled: step.disabled,
                  orientation,
                })
              "
              >{{ state === 'completed' ? '✓' : index + 1 }}</slot
            >
          </StepperIndicator>
          <span>
            <StepperTitle
              :class="classes('clv-stepper__title')"
              v-bind="
                part('title', {
                  item: step,
                  index,
                  value: step.value,
                  disabled: step.disabled,
                  orientation,
                })
              "
              ><slot
                name="trigger"
                :step="step"
                :state="state"
                :context="
                  slotContext('title', {
                    item: step,
                    index,
                    value: step.value,
                    disabled: step.disabled,
                    orientation,
                  })
                "
                >{{ step.title }}</slot
              ></StepperTitle
            >
            <StepperDescription
              v-if="step.description"
              :class="classes('clv-stepper__description')"
              v-bind="
                part('description', {
                  item: step,
                  index,
                  value: step.value,
                  disabled: step.disabled,
                  orientation,
                })
              "
              >{{ step.description }}</StepperDescription
            >
          </span>
        </StepperTrigger>
        <StepperSeparator
          v-if="index < steps.length - 1"
          :class="classes('clv-stepper__separator')"
          v-bind="part('separator', { item: step, index, value: step.value, orientation })"
        />
      </StepperItem>
    </div>
    <section
      :class="classes('clv-stepper__panel')"
      aria-live="polite"
      v-bind="part('panel', { item: activeStep, value: model, orientation })"
    >
      <slot
        name="panel"
        :step="activeStep"
        :context="slotContext('panel', { item: activeStep, value: model, orientation })"
        v-bind="controls"
      />
    </section>
    <div
      :class="classes('clv-stepper__controls')"
      v-bind="part('controls', { item: activeStep, value: model, orientation })"
    >
      <slot
        name="controls"
        :context="slotContext('controls', { item: activeStep, value: model, orientation })"
        v-bind="controls"
      >
        <button
          type="button"
          :disabled="controls.isPrevDisabled"
          @click="controls.prevStep"
          v-bind="
            part('previous', {
              item: activeStep,
              value: model,
              disabled: controls.isPrevDisabled,
              orientation,
            })
          "
        >
          Previous
        </button>
        <button
          type="button"
          :disabled="controls.isNextDisabled"
          @click="controls.nextStep"
          v-bind="
            part('next', {
              item: activeStep,
              value: model,
              disabled: controls.isNextDisabled,
              orientation,
            })
          "
        >
          Next
        </button>
      </slot>
    </div>
  </StepperRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-stepper {
    display: grid;
    gap: var(--clv-space-4);
    color: var(--clv-color-text);
    font-family: var(--clv-font-sans);
  }
  .clv-stepper__list {
    display: flex;
    align-items: flex-start;
  }
  .clv-stepper[data-orientation='vertical'] .clv-stepper__list {
    flex-direction: column;
  }
  .clv-stepper__item {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
  }
  .clv-stepper[data-orientation='vertical'] .clv-stepper__item {
    width: 100%;
    align-items: stretch;
  }
  .clv-stepper__trigger {
    display: flex;
    align-items: center;
    gap: var(--clv-space-2);
    padding: var(--clv-space-2);
    border: 0;
    border-radius: var(--clv-radius-sm);
    background: transparent;
    color: var(--clv-color-text-muted);
    cursor: pointer;
    text-align: left;
    &:focus-visible {
      @include focus-ring;
    }
    &[data-state='active'] {
      color: var(--clv-color-primary);
    }
    &[data-disabled] {
      @include disabled;
    }
  }
  .clv-stepper__indicator {
    display: grid;
    width: 2rem;
    height: 2rem;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid var(--clv-color-border);
    border-radius: 999px;
    font-weight: 850;
  }
  [data-state='active'] > .clv-stepper__indicator,
  [data-state='completed'] > .clv-stepper__indicator {
    border-color: var(--clv-color-primary);
    background: var(--clv-color-selection);
  }
  .clv-stepper__title {
    display: block;
    color: inherit;
    font-weight: 800;
  }
  .clv-stepper__description {
    display: block;
    margin-top: 0.15rem;
    color: var(--clv-color-text-muted);
    font-size: 0.75rem;
  }
  .clv-stepper__separator {
    height: 1px;
    flex: 1;
    background: var(--clv-color-border);
  }
  .clv-stepper[data-orientation='vertical'] .clv-stepper__separator {
    width: 1px;
    height: 1.5rem;
    margin-left: 1rem;
    flex: none;
  }
  .clv-stepper__panel {
    min-height: 5rem;
    padding: var(--clv-space-4);
    border: 1px solid var(--clv-color-border);
    border-radius: var(--clv-radius-md);
    background: var(--clv-color-surface);
  }
  .clv-stepper__controls {
    display: flex;
    justify-content: flex-end;
    gap: var(--clv-space-2);
    button {
      padding: 0.55rem 0.75rem;
      border: 1px solid var(--clv-color-border);
      border-radius: var(--clv-radius-sm);
      background: var(--clv-color-surface);
      color: var(--clv-color-text);
      cursor: pointer;
    }
    button:focus-visible {
      @include focus-ring;
    }
    button:disabled {
      @include disabled;
    }
  }
}
</style>
