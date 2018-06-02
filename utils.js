export const set = function(key, value, obj) {
  const clone = assign({}, obj)
  clone[key] = value
  return clone
}

/**
 * Polyfill for Object.assign for IE11 support
 */
export const assign =
  Object.assign ||
  function assign(to) {
    for (var s = 1; s < arguments.length; s += 1) {
      var from = arguments[s]
      for (var key in from) {
        to[key] = from[key]
      }
    }
    return to
  }
