<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import type { SplitterPanelDefinition } from '../../types'

withDefaults(
  defineProps<{
    panels: SplitterPanelDefinition[]
    direction?: 'horizontal' | 'vertical'
    autoSaveId?: string
    keyboardResizeBy?: number
    label?: string
  }>(),
  {
    direction: 'horizontal',
    autoSaveId: undefined,
    keyboardResizeBy: 10,
    label: 'Resizable panels',
  },
)
const emit = defineEmits<{
  layout: [sizes: number[]]
  collapse: [panel: SplitterPanelDefinition]
  expand: [panel: SplitterPanelDefinition]
  resize: [panel: SplitterPanelDefinition, size: number, previousSize: number | undefined]
}>()
</script>

<template>
  <SplitterGroup
    class="clv-splitter"
    :direction="direction"
    :auto-save-id="autoSaveId"
    :keyboard-resize-by="keyboardResizeBy"
    :aria-label="label"
    @layout="emit('layout', $event)"
  >
    <template v-for="(panel, index) in panels" :key="panel.id">
      <SplitterPanel
        v-slot="state"
        class="clv-splitter__panel"
        :id="panel.id"
        :order="index"
        :default-size="panel.defaultSize"
        :min-size="panel.minSize"
        :max-size="panel.maxSize"
        :collapsible="panel.collapsible"
        :collapsed-size="panel.collapsedSize"
        :size-unit="panel.sizeUnit"
        :aria-label="panel.label"
        @collapse="emit('collapse', panel)"
        @expand="emit('expand', panel)"
        @resize="(size, previousSize) => emit('resize', panel, size, previousSize)"
      >
        <slot name="panel" :panel="panel" :index="index" v-bind="state">
          <strong>{{ panel.label }}</strong>
        </slot>
      </SplitterPanel>
      <SplitterResizeHandle
        v-if="index < panels.length - 1"
        class="clv-splitter__handle"
        :aria-label="`Resize ${panel.label} panel`"
        ><span aria-hidden="true">⋮</span></SplitterResizeHandle
      >
    </template>
  </SplitterGroup>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;
.clv-splitter {
  display: flex;
  min-width: 0;
  min-height: 12rem;
  overflow: hidden;
  border: 1px solid var(--clv-color-border);
  border-radius: var(--clv-radius-md);
  background: var(--clv-color-surface);
  color: var(--clv-color-text);
  font-family: var(--clv-font-sans);
  &[data-panel-group-direction='vertical'] {
    flex-direction: column;
  }
}
.clv-splitter__panel {
  min-width: 0;
  padding: var(--clv-space-4);
  overflow: auto;
}
.clv-splitter__handle {
  position: relative;
  display: grid;
  width: 0.5rem;
  flex: 0 0 0.5rem;
  place-items: center;
  border: 0;
  background: var(--clv-color-border);
  color: var(--clv-color-text-muted);
  cursor: col-resize;
  &:focus-visible {
    @include focus-ring;
  }
  &[data-resize-handle-state='drag'] {
    background: var(--clv-color-primary-strong);
  }
}
.clv-splitter[data-panel-group-direction='vertical'] .clv-splitter__handle {
  width: 100%;
  height: 0.5rem;
  flex-basis: 0.5rem;
  cursor: row-resize;
}
</style>
