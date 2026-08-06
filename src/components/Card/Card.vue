<script setup lang="ts">
import { useClvComponent } from '../../headless'
import type { CardPartContext, CardParts } from '../../parts'

const props = withDefaults(
  defineProps<{
    title?: string
    variant?: 'default' | 'accent' | 'subtle'
    unstyled?: boolean
    parts?: CardParts
  }>(),
  { variant: 'default' },
)

const { classes, part, slotContext } = useClvComponent<CardPartContext>('card', props)
</script>

<template>
  <article
    :class="classes(['clv-card', `clv-card--${variant}`])"
    v-bind="part('root', { variant })"
  >
    <header
      v-if="title || $slots.header"
      :class="classes('clv-card__header')"
      v-bind="part('header', { variant })"
    >
      <slot name="header" :context="slotContext('header', { variant })">
        <h2 v-bind="part('title', { variant })">{{ title }}</h2>
      </slot>
    </header>
    <div :class="classes('clv-card__body')" v-bind="part('body', { variant })">
      <slot :context="slotContext('body', { variant })" />
    </div>
    <footer
      v-if="$slots.footer"
      :class="classes('clv-card__footer')"
      v-bind="part('footer', { variant })"
    >
      <slot name="footer" :context="slotContext('footer', { variant })" />
    </footer>
  </article>
</template>

<style scoped lang="scss">
@layer clv.components {
  .clv-card {
    display: flex;
    min-height: 15rem;
    flex-direction: column;
    padding: var(--clv-space-6);
    border: 1px solid var(--clv-color-border);
    border-radius: var(--clv-radius-lg);
    background: var(--clv-color-surface);
    color: var(--clv-color-text);
    font-family: var(--clv-font-sans);

    &--accent {
      border-color: rgb(116 224 193 / 60%);
    }

    &--subtle {
      background: rgb(255 255 255 / 3%);
    }

    &__header h2 {
      margin: 0 0 var(--clv-space-4);
      font-size: 1.2rem;
    }

    &__body {
      color: var(--clv-color-text-muted);
    }

    &__footer {
      margin-top: auto;
      padding-top: var(--clv-space-6);
      color: var(--clv-color-text-muted);
      font-size: 0.875rem;
    }
  }
}
</style>
