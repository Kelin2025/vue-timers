## vue-timers
Simple mixin to manage timers or intervals for Vue.js

## Installation

### 1. Install from package manager
```
npm install vue-timers
yarn add vue-timers
```

### 2.1. Global import
```javascript
import Vue from 'vue'
import VueTimers from 'vue-timers'

Vue.use(VueTimers)
```

### 2.2. Import mixin locally for components
```javascript
import VueTimers from 'vue-timers/mixin'

export default {
  mixins: [VueTimers]
}
```

## What it does?
It creates timer instances in components and slightly reduces boilerplate code with their handling.  
See the following code
```javascript
export default {
  methods: {
    log () {
      console.log('Hello world')
    }
  },
  created () {
    // It looks ok for first look
    // But imagine that you have more than one timer
    this.$options.interval = setInterval(this.log, 1000)
    // Ok? What about check if timer works?
    // And you it's not reactive so you should create data option
    console.log(this.$options.interval !== null)  
    // Still ok? So what about reusable timers?
    // New method for that? Rly?  
  },
  // Did you forget that it should be destroyed?
  beforeDestroy () {
    clearInterval(this.$options.interval)
  }
}
```

## Timers declaration

### Timer object
```javascript
{
  // Name of timer
  // Default: timer key (with object notation)
  name: String,

  // Tick callback or method name from component
  // Note: callback is binded to component instance
  // Default: name
  callback: Function/String,

  // Autostart timer from created hook
  // Default: true
  autostart: Boolean,

  // Set true to repeat (with setInterval) or false (setTimeout)
  // Default: true
  repeat: Boolean,

  // Set true to call first tick immediate 
  // Note: repeat must be true too
  // Default: false
  immediate: Boolean,

  // Time between ticks
  // Default: 1000
  time: Number
}
```

### Object notation 
```javascript
export default {
  timers: {
    log: {
      time: 1000,
      immediate: true
    },
    log2: {
      time: 2000,
      immediate: true
    },
    log3: {
      time: 1000,
      repeat: false,
      callback () {
        console.log('I\'m not like others and work once')
      }
    }
  },
  methods: {
    log () {
      console.log('It works!')
    },
    log2 () {
      console.log('It works two times slower!')
    }
  }
}
```

### Array notation
```javascript
export default {
  timers: [
    { name: 'log', timer: 1000, immediate: true },
    { name: 'log2', timer: 1000, immediate: true },
    { name: 'log3', timer: 1000, repeat: false, 
      callback () {
        console.log('I\'m not like others and work once')
      }
    }
  ],
  methods: {
    log () {
      console.log('It works!')
    },
    log2 () {
      console.log('It works two times slower!')
    }
  }
}
```

### Use with helper
```javascript
import { timer } from 'vue-timers'

export default {
  timers: [
    timer('log', 1000, { immediate: true }),
    timer('log2', 2000, { immediate: true }),
    timer('log3', 1000, { 
      repeat: false, 
      callback () {
        console.log('I\'m not like others and work once')
      }
    })
  ],
  methods: {
    log () {
      console.log('It works!')
    },
    log2 () {
      console.log('It works two times slower!')
    }
  }
}
```

## Timers handling

### Local methods
```javascript
import { timer } from 'vue-timers'

export default {
  timers: [
    timer('log', 1000, { 
      autostart: false 
    })
  ],
  methods: {
    log () {
      console.log('It works!')
    }
  },
  created () {
    // Start timer
    this.timers.log.start()
    // Stop timer
    this.timers.log.stop()
  }
}
```

### Global methods
```javascript
import { timer } from 'vue-timers'

export default {
  timers: [
    timer('log', 1000, { 
      autostart: false 
    })
  ],
  methods: {
    log () {
      console.log('It works!')
    },
    log2 () {
      console.log('It works too!')
    }
  },
  created () {
    // Start timer 'log'
    this.$timers.start('log')
    // Stop timer 'log'
    this.$timers.stop('log')
    // Add timer 'log2'
    this.$timers.add({
      name: 'log2',
      immediate: true
    })
    // Remove timer 'log'
    // CAUTION: Note that it removes log from data too
    this.$timers.remove('log')
    // Start timer
    this.timers.log.start()
    // Stop timer
    this.timers.log.stop()
  }
}
```

### isRunning property
```vue
<template>
  <div id="app">
    <!-- CAUTION: If you'll remove timer, it will cause error -->
    <h1 v-if="timers.log.isRunning">Timer is running</h1>
    <h1 v-else>Timer is not running</h1>
  </div>
</template>

<script>
import { timer } from 'vue-timers'

export default {
  timers: [
    timer('log', 1000)
  ],
  methods: {
    log () {
      console.log('It works!')
    }
  }
}
</script>
```

### Timer events
It also fires events for timer start/stop, tick and add/remove:

#### Component.vue
```javascript
import { timer } from 'vue-timers'

export default {
  timers: [
    timer('log', 1000)
  ],
  methods: {
    log () {
      console.log('It works!')
    }
  }
}
```

#### App.vue
```vue
<template>
  <timer-component
    @timer-start:timerName="log('start')"
    @timer-stop:timerName="log('stop')"
    @timer-tick:timerName="log('tick')"
    @timer-start:timerName="log('start')"
    @timer-remove:timerName="log('remove')"
  />
</template>
```

## Author
[Anton Kosykh](https://github.com/kelin2025)

## License
MIT
