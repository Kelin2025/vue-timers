import { mount } from '@vue/test-utils'
import {mixin as VueTimers} from '../index'

const component1 = {
  template: '<div></div>',
  name: 'component1',
  mixins: [VueTimers],
  timers: {
    log: { time: 1000, autostart: true, isSwitchTab: true }
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

const component2 = {
  template: '<div></div>',
  name: 'component2'
}

const view = {
  template: `<keep-alive>
  <component :is="view"></component>
</keep-alive>`,
  components: { component1, component2 },
  data() {
    return {
      view: 'component1'
    }
  }
}

describe('isSwitchTab: true', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('test switch tab', async () => {
    const wrapper = mount(view)
    const child = wrapper.vm.$children[0]

    expect(child.timers.log.isRunning).toBe(true)
    expect(child.count).toBe(0)
    jest.advanceTimersByTime(1000)
    expect(child.count).toBe(1)

    // swtich tab to component2
    wrapper.setData({ view: 'component2' })
    await wrapper.vm.$nextTick()
    expect(child.timers.log.isRunning).toBe(false)
    // timer will not execute when deactivated
    jest.advanceTimersByTime(1000)
    expect(child.count).toBe(1)

    // swtich tab back to component1
    wrapper.setData({ view: 'component1' })
    await wrapper.vm.$nextTick()
    expect(child.timers.log.isRunning).toBe(true)
    // timer will execute when activated
    jest.advanceTimersByTime(1000)
    expect(child.count).toBe(2)
  })

  it('test switch tab with immediate', async () => {
    // change timers`s config
    component1.timers = {
      log: { time: 1000, autostart: true, isSwitchTab: true, immediate: true }
    }
    const wrapper = mount(view)
    const child = wrapper.vm.$children[0]

    expect(child.timers.log.isRunning).toBe(true)
    expect(child.count).toBe(1)
    jest.advanceTimersByTime(1000)
    expect(child.count).toBe(2)

    // swtich tab to component2
    wrapper.setData({ view: 'component2' })
    await wrapper.vm.$nextTick()
    expect(child.timers.log.isRunning).toBe(false)
    // timer will not execute when deactivated
    jest.advanceTimersByTime(1000)
    expect(child.count).toBe(2)

    // swtich tab back to component1
    wrapper.setData({ view: 'component1' })
    await wrapper.vm.$nextTick()
    expect(child.timers.log.isRunning).toBe(true)
    // timer will execute when activated
    expect(child.count).toBe(3)
    jest.advanceTimersByTime(1000)
    expect(child.count).toBe(4)
  })
})
