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

const model = defineModel<number>({ default: 1 })
const props = withDefaults(
  defineProps<{
    steps: StepperStep[]
    linear?: boolean
    orientation?: 'horizontal' | 'vertical'
    label?: string
  }>(),
  { linear: true, orientation: 'horizontal', label: 'Progress' },
)
const activeStep = computed(() => props.steps.find((step) => step.value === model.value))
</script>

<template>
  <StepperRoot
    v-slot="controls"
    v-model="model"
    class="clv-stepper"
    :linear="linear"
    :orientation="orientation"
    :aria-label="label"
  >
    <div class="clv-stepper__list">
      <StepperItem
        v-for="(step, index) in steps"
        :key="step.value"
        v-slot="{ state }"
        class="clv-stepper__item"
        :step="step.value"
        :disabled="step.disabled"
        :completed="step.completed"
      >
        <StepperTrigger class="clv-stepper__trigger">
          <StepperIndicator class="clv-stepper__indicator">
            <slot name="indicator" :step="step" :state="state">{{
              state === 'completed' ? '✓' : index + 1
            }}</slot>
          </StepperIndicator>
          <span>
            <StepperTitle class="clv-stepper__title"
              ><slot name="trigger" :step="step" :state="state">{{
                step.title
              }}</slot></StepperTitle
            >
            <StepperDescription v-if="step.description" class="clv-stepper__description">{{
              step.description
            }}</StepperDescription>
          </span>
        </StepperTrigger>
        <StepperSeparator v-if="index < steps.length - 1" class="clv-stepper__separator" />
      </StepperItem>
    </div>
    <section class="clv-stepper__panel" aria-live="polite">
      <slot name="panel" :step="activeStep" v-bind="controls" />
    </section>
    <div class="clv-stepper__controls">
      <slot name="controls" v-bind="controls">
        <button type="button" :disabled="controls.isPrevDisabled" @click="controls.prevStep">
          Previous
        </button>
        <button type="button" :disabled="controls.isNextDisabled" @click="controls.nextStep">
          Next
        </button>
      </slot>
    </div>
  </StepperRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;
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
</style>
