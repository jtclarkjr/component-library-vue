export const CLV_THEME_KEYS = ['default', 'aqua', 'neutral'] as const
export const CLV_THEME_MODES = ['dark', 'light'] as const

export const alwaysProtected = [
  'data-clv-component',
  'data-clv-unstyled',
  'data-disabled',
  'data-invalid',
  'data-loading',
  'data-orientation',
  'data-part',
  'data-readonly',
  'data-size',
  'data-variant',
] as const

/**
 * Part attributes are presentation hooks. Public component props and these nested primitive props
 * carry the component's model/form contract, so a trailing `v-bind="part(...)"` must never be able
 * to replace them on a Reka component.
 */
export const authoritativePartProps = new Set([
  'as',
  'aschild',
  'checked',
  'defaultchecked',
  'defaultopen',
  'defaultvalue',
  'expanded',
  'forcemount',
  'form',
  'getchildren',
  'getkey',
  'href',
  'indeterminate',
  'level',
  'modelvalue',
  'open',
  'page',
  'part',
  'pressed',
  'selected',
  'step',
  'value',
])

export const authoritativeAriaStates = new Set([
  'aria-busy',
  'aria-checked',
  'aria-current',
  'aria-disabled',
  'aria-expanded',
  'aria-hidden',
  'aria-invalid',
  'aria-modal',
  'aria-multiselectable',
  'aria-orientation',
  'aria-posinset',
  'aria-pressed',
  'aria-readonly',
  'aria-required',
  'aria-selected',
  'aria-setsize',
  'aria-valuemax',
  'aria-valuemin',
  'aria-valuenow',
  'aria-valuetext',
])

export const ariaRelationships = new Set([
  'aria-activedescendant',
  'aria-controls',
  'aria-describedby',
  'aria-details',
  'aria-errormessage',
  'aria-flowto',
  'aria-labelledby',
  'aria-owns',
])
