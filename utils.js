export function isFunction(cb) {
  return typeof callback === 'function'
}

export function has(prop) {
  return function(obj) {
    return prop in obj
  }
}

export function set(key, value, obj) {
  return Object.assign({}, obj, { [key]: value })
}
