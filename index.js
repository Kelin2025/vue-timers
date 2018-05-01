import mixin from './mixin'
import utils from './utils'

export default function(Vue) {
  Vue.mixin(mixin)
}

export function timer(name, time, options) {
  return utils.assign({ name: name, time: time }, options)
}
