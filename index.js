import mixin from './mixin'

export default function(Vue) {
  Vue.mixin(mixin)
}

export function timer(name, time, options) {
  return Object.assign({ name: name, time: time }, options)
}
