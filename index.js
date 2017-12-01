import mixin from './mixin'

export default function (Vue) {
  Vue.mixin(mixin)
}

export function createTimer (name, time, options) {
  return Object.assign({ name, time }, options)
}
