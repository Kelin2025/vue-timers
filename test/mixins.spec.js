import { mount } from '@vue/test-utils'
import {mixin as VueTimers} from '../index'

const component = {
  template: '<div></div>',
  mixins: [VueTimers],
  timers: {
    log: { time: 1000 }
  },
  data() {
    return {
      count: 0
    }
  },
  methods: {
    log() {
      this.count++
    }
  }
}

describe('default options', () => {
  // Now mount the component and you have the wrapper
  const wrapper = mount(component)

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
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

  it('should be has default options', () => {
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
    expect(wrapper.vm.count).toBe(0)
    jest.advanceTimersByTime(1000)
    expect(wrapper.vm.count).toBe(1)

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
  const wrapper = mount(component)

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
    timers: {
      log: { time: 1000, autostart: true }
    }
  })

  it('test start and stop', () => {
    expect(wrapper.vm.timers.log.isRunning).toBe(true)
    expect(wrapper.emitted()['timer-start:log']).toBeTruthy()
  })
})

describe('immediate: true', () => {
  // Now mount the component and you have the wrapper
  const wrapper = mount(component, {
    timers: {
      log: { time: 1000, immediate: true }
    }
  })

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  it('test immediate: true', () => {
    wrapper.vm.$timer.start('log')
    expect(wrapper.vm.count).toBe(1)
    jest.advanceTimersByTime(1000)
    expect(wrapper.vm.count).toBe(2)
  })
})
