import mixin from './mixin'


export default {
  
  set: function (key, value, obj) {
    const clone = this.assign({}, obj)
    clone[key] = value
    return clone
  },

  /**
   * Polyfill for Object.assign for IE11 support
   */
  assign: Object.assign || function assign(to) {
    for (var s = 1; s < arguments.length; s += 1) {
      var from = arguments[s]
      for (var key in from) {
        to[key] = from[key]
      }
    }
    return to
  }
}
