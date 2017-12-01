function configNormalizer (vm) {
  function isFunction (callback) {
    var type = typeof callback
    if (type !== 'function') {
      throw new TypeError('Timer callback is ' + type + ' but expected string/function/undefined')
    }
  }

  function isMethodAvailable (name) {
    if (!(name in vm)) {
      throw new ReferenceError('Timer callback ' + name + ' not found in Vue instance')
    }
    isFunction(vm[name])
  }

  return function normalizeConfig (config) {
    if (Array.isArray(config)) {
      return normalizeConfig({ name: config[0], ...config[1] })
    }
    var cfg = {}
    cfg.name = config.name
    cfg.repeat = config.repeat || true
    cfg.time = config.time || 1000
    cfg.immediate = config.repeat && (config.immediate || false)
    cfg.instance = null
    cfg.autostart = config.autostart || true
    cfg.isRunning = false
    cfg.start = function startInterval () {
      if (cfg.isRunning) return
      cfg.instance = (cfg.repeat ? setInterval : setTimeout)(cfg.callback, cfg.time)
      if (cfg.immediate) {
        cfg.callback()
      }
      cfg.isRunning = true
      vm.$emit('timer-start:' + cfg.name)
    }
    cfg.stop = function stopInterval () {
      (cfg.repeat ? clearInterval : clearTimeout)(cfg.instance)
      cfg.isRunning = false
      vm.$emit('timer-stop:' + cfg.name)
    }
    var cb
    if (!config.callback) {
      isMethodAvailable(config.name)
      cb = vm[config.name]
    } else {
      switch (typeof config.callback) {
        case 'function':
          cb = config.callback
          break
        case 'string':
          isMethodAvailable(config.callback)
          cb = vm[config.callback]
          break
        default:
          isFunction(config.callback)
      }
    }
    cb = cb.bind(vm)
    cfg.callback = function timerTick () {
      cb()
      vm.$emit('timer-tick:' + cfg.name)
      if (!cfg.repeat) {
        cfg.isRunning = false
      }
      vm.$emit('timer-stop:' + cfg.name)
    }
    return cfg
  }
}

export default {
  data () {
    var vm = this
    var normalize = configNormalizer(vm)

    var timers = {}

    this.$timers = {
      add (config) {
        var cfg = normalize(config)
        vm.$set(timers, cfg.name, cfg)
        if (cfg.autostart) {
          cfg.start()
        }
        vm.$emit('timer-add:' + name)
      },

      start (name) {
        timers[name].start()
      },

      stop (name) {
        timers[name].stop()
      },

      remove (name) {
        this.stop(name)
        vm.$delete(timers, name)
        vm.$emit('timer-remove:' + name)
      }
    }

    if (!this.$options.timers) {
      return {
        $timers: {}
      }
    }

    var options = {}

    if (Array.isArray(this.$options.timers)) {
      for (var index in this.$options.timers) {
        this.$timers.add(Object.assign({
          name: this.$options.timers[index].name
        }, this.$options.timers[index]))
      }
    } else {
      for (var name in this.$options.timers) {
        this.$timers.add(Object.assign({ name }, options[name]))
      }
      options = this.$options.timers
    }

    return { timers }
  },
  beforeDestroy () {
    for (var name in this.$timers) {
      this.$timers.remove(name)
    }
  }
}
