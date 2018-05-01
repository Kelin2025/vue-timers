import mixin from './mixin'
import utils from './utils'

export default function(Vue) {
  Vue.mixin(mixin)
}

export function timer(name, time, options) {
  var r
  var s = { name: name, time: time }
  if (typeof Object.assign == 'function') {
    r = Object.assign(s, options)
  } else {
    r = utils.assign(s, options)
  }
  return r
}
