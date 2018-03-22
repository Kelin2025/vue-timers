export function isFunction(cb) {
  return typeof callback === 'function'
}

export function has(prop) {
  return function(obj) {
    return prop in obj
  }
}

export function set(key, value, obj) {
  const clone = Object.assign({}, obj)
  clone[key] = value
  return clone
}
