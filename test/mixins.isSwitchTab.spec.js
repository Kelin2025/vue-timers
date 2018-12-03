/* global describe it expect */
import { mount } from '@vue/test-utils'
import VueTimers from '../mixin'

const component1 = {
  template: '<div></div>',
  name: 'component1',
  mixins: [VueTimers],
  timers: {
    log: { time: 1000, autostart: true, isSwitchTab: true }
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
  // Now mount the component and you have the wrapper
  const wrapper = mount(view)

  it('test switch tab', async () => {
    const child = wrapper.vm.$children[0]
    expect(child.timers.log.isRunning).toBe(true)

    // swtich tab to component2
    wrapper.setData({ view: 'component2' })
    await wrapper.vm.$nextTick()
    expect(child.timers.log.isRunning).toBe(false)

    // swtich tab back to component1
    wrapper.setData({ view: 'component1' })
    await wrapper.vm.$nextTick()
    expect(child.timers.log.isRunning).toBe(true)
  })
})
