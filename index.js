import VueTimers from './mixin'
import { assign } from './utils'

export default function(Vue) {
  Vue.config.optionMergeStrategies.timers = Vue.config.optionMergeStrategies.methods
  Vue.mixin(VueTimers)
}

export function timer(name, time, options) {
  return assign({ name: name, time: time }, options)
}

export const mixin = VueTimers
