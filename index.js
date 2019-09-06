import VueTimers from './mixin'
import { assign } from './utils'

export default function install(Vue) {
  Vue.config.optionMergeStrategies.timers = Vue.config.optionMergeStrategies.methods
  Vue.mixin(VueTimers)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export function timer(name, time, options) {
  return assign({ name: name, time: time }, options)
}

export const mixin = VueTimers
