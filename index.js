import assign from './assign.js'
import mixin from './mixin'
import utils from './utils'

export default function(Vue) {
  Vue.mixin(mixin)
}

export function timer(name, time, options) {
  return Object.assign({ name: name, time: time }, options)
}