/* global describe it expect */
import { mount } from '@vue/test-utils'
import VueTimers from '../mixin'

const component = { template: '<div></div>' }

describe('default options', () => {
  // Now mount the component and you have the wrapper
  const wrapper = mount(component, {
    mixins: [VueTimers],
    timers: {
      log: { time: 1000 }
    },
    data() {
      return {
        test: 0
      }
    },
    methods: {
      log() {
        this.test++
      }
    }
  })

  it('start the timer which not exist', () => {
    try {
      wrapper.vm.$timer.start('notExist')
    } catch (e) {
      expect(e).toEqual(
        new ReferenceError('[vue-timers.start] Cannot find timer notExist')
      )
    }
  })

  it('stop the timer which not exist', () => {
    try {
      wrapper.vm.$timer.stop('notExist')
    } catch (e) {
      expect(e).toEqual(
        new ReferenceError('[vue-timers.stop] Cannot find timer notExist')
      )
    }
  })

  it('should be default options', () => {
    expect(wrapper.vm.$options.timers.log).toEqual({
      name: 'log',
      time: 1000,
      repeat: false,
      immediate: false,
      autostart: false,
      isSwitchTab: false,
      callback: wrapper.vm.log
    })
  })

  it('test start and stop', () => {
    wrapper.vm.$timer.start('log')
    expect(wrapper.vm.timers.log.isRunning).toBe(true)
    expect(wrapper.emitted()['timer-start:log']).toBeTruthy()

    wrapper.vm.$timer.stop('log')
    expect(wrapper.vm.timers.log.isRunning).toBe(false)
    expect(wrapper.emitted()['timer-stop:log']).toBeTruthy()
  })

  it('test restart', () => {
    wrapper.vm.$timer.restart('log')
    expect(wrapper.vm.timers.log.isRunning).toBe(true)
    expect(wrapper.emitted()['timer-restart:log']).toBeTruthy()
  })
})

describe('execute start or stop 2 times', () => {
  // Now mount the component and you have the wrapper
  const wrapper = mount(component, {
    mixins: [VueTimers],
    timers: {
      log: { time: 1000 }
    },
    data() {
      return {
        test: 0
      }
    },
    methods: {
      log() {
        this.test++
      }
    }
  })

  it('test execute start or stop 2 times', () => {
    wrapper.vm.$timer.start('log')
    wrapper.vm.$timer.start('log')
    expect(wrapper.emitted()['timer-start:log'].length).toBe(1)

    wrapper.vm.$timer.stop('log')
    wrapper.vm.$timer.stop('log')
    expect(wrapper.emitted()['timer-stop:log'].length).toBe(1)
  })
})

describe('autoStart: true', () => {
  // Now mount the component and you have the wrapper
  const wrapper = mount(component, {
    mixins: [VueTimers],
    timers: {
      log: { time: 1000, autostart: true }
    },
    data() {
      return {
        test: 0
      }
    },
    methods: {
      log() {
        this.test++
      }
    }
  })

  it('test start and stop', () => {
    expect(wrapper.vm.timers.log.isRunning).toBe(true)
    expect(wrapper.emitted()['timer-start:log']).toBeTruthy()

    wrapper.vm.$timer.stop('log')
    expect(wrapper.vm.timers.log.isRunning).toBe(false)
    expect(wrapper.emitted()['timer-stop:log']).toBeTruthy()
  })
})
