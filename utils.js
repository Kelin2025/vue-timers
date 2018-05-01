export function set(key, value, obj) {
  const clone = Object.assign({}, obj)
  clone[key] = value
  return clone
}