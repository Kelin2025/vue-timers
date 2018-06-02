import { set } from './utils'

function generateData(timers) {
  return Object.keys(timers).reduce(function(acc, cur) {
    return set(
      cur,
      {
        isRunning: false,
        time: timers[cur].time || 0,
        instance: null
      },
      acc
    )
  }, {})
}

function setTimer(repeat) {
  return repeat ? setInterval : setTimeout
}

function clearTimer(repeat) {
  return repeat ? clearInterval : clearTimeout
}

function generateTimer(options, vm) {
  return setTimer(options.repeat)(function() {
    vm.$emit('timer-tick:' + options.name)
    options.callback()
  }, options.time)
}

function normalizeConfig(config, vm) {
  if (process.env.NODE_ENV !== 'production') {
    if (!config.name) {
      throw new Error('[vue-timers.create] name is required')
    }
    if (!config.callback && typeof vm[config.name] !== 'function') {
      throw new ReferenceError(
        '[vue-timers.create] Cannot find method ' + config.name
      )
    }
    if (config.callback && typeof config.callback !== 'function') {
      throw new TypeError(
        '[vue-timers.create] Timer callback should be a function, ' +
          typeof config.callback +
          ' given'
      )
    }
  }
  return {
    name: config.name,
    time: config.time || 0,
    repeat: 'repeat' in config ? config.repeat : false,
    immediate: 'immediate' in config ? config.immediate : false,
    autostart: 'autostart' in config ? config.autostart : false,
    callback: (config.callback && config.callback.bind(vm)) || vm[config.name]
  }
}

function normalizeOptions(options, vm) {
  return Array.isArray(options)
    ? options.reduce(function(res, config) {
      return set(config.name, normalizeConfig(config, vm), res)
    }, {})
    : Object.keys(options).reduce(function(res, key) {
      return set(
        key,
        normalizeConfig(set('name', key, options[key]), vm),
        res
      )
    }, {})
}

export default {
  data: function() {
    if (!this.$options.timers) return {}
    this.$options.timers = normalizeOptions(this.$options.timers, this)
    return {
      timers: generateData(this.$options.timers)
    }
  },

  created: function() {
    if (!this.$options.timers) return
    var vm = this
    var data = vm.timers
    var options = vm.$options.timers
    vm.$timer = {
      start: function(name) {
        if (process.env.NODE_ENV !== 'production' && !(name in options)) {
          throw new ReferenceError(
            '[vue-timers.start] Cannot find timer ' + name
          )
        }
        if (data[name].isRunning) return
        data[name].isRunning = true
        data[name].instance = generateTimer(
          set('time', data[name].time, options[name]),
          vm
        )
        if (options[name].immediate) {
          vm.$emit('timer-tick:' + name)
          options[name].callback()
        }
        vm.$emit('timer-start:' + name)
      },

      stop: function(name) {
        if (process.env.NODE_ENV !== 'production' && !(name in options)) {
          throw new ReferenceError(
            '[vue-timers.stop] Cannot find timer ' + name
          )
        }
        if (!data[name].isRunning) return
        clearTimer(options[name].repeat)(data[name].instance)
        data[name].isRunning = false
        vm.$emit('timer-stop:' + name)
      }
    }
  },

  mounted: function() {
    if (!this.$options.timers) return
    var vm = this
    var options = vm.$options.timers
    Object.keys(options).forEach(function(key) {
      if (options[key].autostart) {
        vm.$timer.start(key)
      }
    })
  },

  beforeDestroy: function() {
    if (!this.$options.timers) return
    var vm = this
    Object.keys(vm.$options.timers).forEach(function(key) {
      vm.$timer.stop(key)
    })
  }
}
