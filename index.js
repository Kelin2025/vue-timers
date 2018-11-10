import mixin from './mixin'
import { assign } from './utils'

export default function(Vue) {
  Vue.config.optionMergeStrategies.timers = Vue.config.optionMergeStrategies.methods
  Vue.mixin(mixin)
}

export function timer(name, time, options) {
  return assign({ name: name, time: time }, options)
}
