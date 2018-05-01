import mixin from './mixin'

export function set(key, value, obj) {
  const clone = mixin.assign({}, obj)
  clone[key] = value
  return clone
}
