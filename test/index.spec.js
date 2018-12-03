/* global describe it expect */
import Vue from 'vue'
import VueTimers from '../index'
import { mount } from '@vue/test-utils'

Vue.use(VueTimers)

const component = { template: '<div></div>' }

describe('global import', () => {
  // Now mount the component and you have the wrapper
  const wrapper = mount(component, {
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

  it('test timers with global import', () => {
    wrapper.vm.$timer.start('log')
    expect(wrapper.vm.timers.log.isRunning).toBe(true)

    wrapper.vm.$timer.stop('log')
    expect(wrapper.vm.timers.log.isRunning).toBe(false)
  })
})
