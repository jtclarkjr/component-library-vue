<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    variant?: 'default' | 'accent' | 'subtle'
  }>(),
  { variant: 'default' },
)
</script>

<template>
  <article class="clv-card" :class="`clv-card--${variant}`">
    <header v-if="title || $slots.header" class="clv-card__header">
      <slot name="header">
        <h2>{{ title }}</h2>
      </slot>
    </header>
    <div class="clv-card__body"><slot /></div>
    <footer v-if="$slots.footer" class="clv-card__footer"><slot name="footer" /></footer>
  </article>
</template>

<style scoped lang="scss">
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
</style>
