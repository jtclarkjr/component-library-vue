<script setup lang="ts">
import { computed } from 'vue'
import { TreeItem, TreeRoot, TreeVirtualizer } from 'reka-ui'

import { useClvComponent } from '../../headless'
import type { TreePartContext, TreeParts } from '../../parts'
import type { ClvValue, TreeNode } from '../../types'

const model = defineModel<ClvValue | ClvValue[]>()
const expanded = defineModel<ClvValue[]>('expanded', { default: () => [] })
const props = withDefaults(
  defineProps<{
    items: TreeNode[]
    multiple?: boolean
    disabled?: boolean
    propagateSelect?: boolean
    bubbleSelect?: boolean
    selectionBehavior?: 'toggle' | 'replace'
    virtualize?: boolean
    estimateSize?: number
    overscan?: number
    label?: string
    unstyled?: boolean
    parts?: TreeParts
  }>(),
  {
    multiple: false,
    disabled: false,
    propagateSelect: false,
    bubbleSelect: false,
    selectionBehavior: 'toggle',
    virtualize: false,
    estimateSize: 36,
    overscan: 8,
    label: 'Tree',
  },
)
const { classes, part, slotContext } = useClvComponent<TreePartContext>('tree', props)
const emit = defineEmits<{
  select: [node: TreeNode, event: Event]
  toggle: [node: TreeNode, event: Event]
}>()

const flatNodes = computed(() => {
  const result: TreeNode[] = []
  const visit = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      result.push(node)
      if (node.children) visit(node.children)
    }
  }
  visit(props.items)
  return result
})
const keyFor = (node: TreeNode) => `${typeof node.value}:${node.value}`
const isSelected = (node: TreeNode) =>
  Array.isArray(model.value) ? model.value.includes(node.value) : model.value === node.value
const isExpanded = (node: TreeNode) => expanded.value.includes(node.value)
const nodeByKey = computed(() => new Map(flatNodes.value.map((node) => [keyFor(node), node])))
const selectedNodes = computed<TreeNode | TreeNode[] | undefined>({
  get() {
    if (Array.isArray(model.value)) {
      return model.value
        .map((value) => flatNodes.value.find((node) => node.value === value))
        .filter((node): node is TreeNode => Boolean(node))
    }
    return flatNodes.value.find((node) => node.value === model.value)
  },
  set(value) {
    model.value = Array.isArray(value) ? value.map((node) => node.value) : value?.value
  },
})
const expandedKeys = computed<string[]>({
  get: () => expanded.value.map((value) => `${typeof value}:${value}`),
  set: (keys) => {
    expanded.value = keys
      .map((key) => nodeByKey.value.get(key)?.value)
      .filter((value): value is ClvValue => value !== undefined)
  },
})
</script>

<template>
  <TreeRoot
    v-slot="{ flattenItems }"
    v-model="selectedNodes"
    v-model:expanded="expandedKeys"
    :class="classes('clv-tree')"
    :items="items"
    :get-key="keyFor"
    :get-children="(node) => node.children"
    :multiple="multiple"
    :disabled="disabled"
    :propagate-select="propagateSelect"
    :bubble-select="bubbleSelect"
    :selection-behavior="selectionBehavior"
    :aria-label="label"
    v-bind="part('root', { disabled })"
  >
    <TreeVirtualizer
      v-if="virtualize"
      :estimate-size="estimateSize"
      :overscan="overscan"
      :text-content="(item) => item.label"
    >
      <template #default="{ item }">
        <TreeItem
          v-slot="state"
          :class="classes('clv-tree__item')"
          :value="item.value"
          :level="item.level"
          :disabled="item.value.disabled"
          :style="{ paddingInlineStart: `${item.level * 1.1}rem` }"
          @select="emit('select', item.value, $event)"
          @toggle="emit('toggle', item.value, $event)"
          v-bind="
            part('item', {
              node: item.value,
              index: flattenItems.indexOf(item),
              level: item.level,
              selected: isSelected(item.value),
              expanded: isExpanded(item.value),
              disabled: item.value.disabled,
            })
          "
        >
          <button
            v-if="item.value.children?.length"
            :class="classes('clv-tree__toggle')"
            type="button"
            :aria-label="`${state.isExpanded ? 'Collapse' : 'Expand'} ${item.value.label}`"
            @click.stop="state.handleToggle"
            v-bind="
              part('toggle', {
                node: item.value,
                index: flattenItems.indexOf(item),
                level: item.level,
                selected: state.isSelected,
                expanded: state.isExpanded,
                disabled: item.value.disabled,
              })
            "
          >
            <slot
              name="toggle-icon"
              :node="item.value"
              :index="flattenItems.indexOf(item)"
              :level="item.level"
              :selected="state.isSelected"
              :expanded="state.isExpanded"
              :disabled="item.value.disabled"
              :context="
                slotContext('toggle', {
                  node: item.value,
                  index: flattenItems.indexOf(item),
                  level: item.level,
                  selected: state.isSelected,
                  expanded: state.isExpanded,
                  disabled: item.value.disabled,
                })
              "
            >
              {{ state.isExpanded ? '⌄' : '›' }}
            </slot>
          </button>
          <span
            v-else
            :class="classes('clv-tree__spacer')"
            v-bind="
              part('spacer', {
                node: item.value,
                index: flattenItems.indexOf(item),
                level: item.level,
                selected: state.isSelected,
                expanded: state.isExpanded,
                disabled: item.value.disabled,
              })
            "
          />
          <slot
            name="node"
            :node="item.value"
            :level="item.level"
            :context="
              slotContext('node', {
                node: item.value,
                index: flattenItems.indexOf(item),
                level: item.level,
                selected: state.isSelected,
                expanded: state.isExpanded,
                disabled: item.value.disabled,
              })
            "
            v-bind="state"
          >
            <span
              v-bind="
                part('node', {
                  node: item.value,
                  index: flattenItems.indexOf(item),
                  level: item.level,
                  selected: state.isSelected,
                  expanded: state.isExpanded,
                  disabled: item.value.disabled,
                })
              "
              >{{ item.value.label }}</span
            >
            <small v-if="item.value.description">{{ item.value.description }}</small>
          </slot>
        </TreeItem>
      </template>
    </TreeVirtualizer>
    <template v-else>
      <TreeItem
        v-for="(item, index) in flattenItems"
        :key="keyFor(item.value)"
        v-slot="state"
        :class="classes('clv-tree__item')"
        :value="item.value"
        :level="item.level"
        :disabled="item.value.disabled"
        :style="{ paddingInlineStart: `${item.level * 1.1}rem` }"
        @select="emit('select', item.value, $event)"
        @toggle="emit('toggle', item.value, $event)"
        v-bind="
          part('item', {
            node: item.value,
            index,
            level: item.level,
            selected: isSelected(item.value),
            expanded: isExpanded(item.value),
            disabled: item.value.disabled,
          })
        "
      >
        <button
          v-if="item.value.children?.length"
          :class="classes('clv-tree__toggle')"
          type="button"
          :aria-label="`${state.isExpanded ? 'Collapse' : 'Expand'} ${item.value.label}`"
          @click.stop="state.handleToggle"
          v-bind="
            part('toggle', {
              node: item.value,
              index,
              level: item.level,
              selected: state.isSelected,
              expanded: state.isExpanded,
              disabled: item.value.disabled,
            })
          "
        >
          <slot
            name="toggle-icon"
            :node="item.value"
            :index="index"
            :level="item.level"
            :selected="state.isSelected"
            :expanded="state.isExpanded"
            :disabled="item.value.disabled"
            :context="
              slotContext('toggle', {
                node: item.value,
                index,
                level: item.level,
                selected: state.isSelected,
                expanded: state.isExpanded,
                disabled: item.value.disabled,
              })
            "
          >
            {{ state.isExpanded ? '⌄' : '›' }}
          </slot>
        </button>
        <span
          v-else
          :class="classes('clv-tree__spacer')"
          v-bind="
            part('spacer', {
              node: item.value,
              index,
              level: item.level,
              selected: state.isSelected,
              expanded: state.isExpanded,
              disabled: item.value.disabled,
            })
          "
        />
        <slot
          name="node"
          :node="item.value"
          :level="item.level"
          :context="
            slotContext('node', {
              node: item.value,
              index,
              level: item.level,
              selected: state.isSelected,
              expanded: state.isExpanded,
              disabled: item.value.disabled,
            })
          "
          v-bind="state"
        >
          <span
            v-bind="
              part('node', {
                node: item.value,
                index,
                level: item.level,
                selected: state.isSelected,
                expanded: state.isExpanded,
                disabled: item.value.disabled,
              })
            "
            >{{ item.value.label }}</span
          >
          <small v-if="item.value.description">{{ item.value.description }}</small>
        </slot>
      </TreeItem>
    </template>
  </TreeRoot>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as *;

@layer clv.components {
  .clv-tree {
    max-height: 24rem;
    margin: 0;
    padding: var(--clv-space-1);
    overflow: auto;
    border: 1px solid var(--clv-color-border);
    border-radius: var(--clv-radius-md);
    background: var(--clv-color-surface);
    color: var(--clv-color-text);
    font-family: var(--clv-font-sans);
    list-style: none;
  }
  .clv-tree__item {
    display: flex;
    min-height: 2.25rem;
    align-items: center;
    gap: var(--clv-space-2);
    padding-block: 0.35rem;
    padding-right: var(--clv-space-2);
    border-radius: var(--clv-radius-sm);
    cursor: pointer;
    outline: none;
    &[data-selected] {
      background: var(--clv-color-selection);
      color: var(--clv-color-primary);
    }
    &[data-disabled] {
      @include disabled;
    }
    &:focus-visible {
      @include focus-ring;
      outline-offset: -2px;
    }
    small {
      margin-left: auto;
      color: var(--clv-color-text-muted);
    }
  }
  .clv-tree__toggle {
    display: grid;
    width: 1.5rem;
    height: 1.5rem;
    place-items: center;
    border: 0;
    border-radius: 0.25rem;
    background: transparent;
    color: var(--clv-color-text-muted);
    cursor: pointer;
    &:focus-visible {
      @include focus-ring;
    }
  }
  .clv-tree__spacer {
    width: 1.5rem;
  }
}
</style>
