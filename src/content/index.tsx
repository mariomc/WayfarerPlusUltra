import React from 'react'
import { render } from 'react-dom'
import { WayfarerUltra } from './components/index'

const reactRoot = document.createElement('div')

function codeToInject() {
  const oldDevTools = window['__REDUX_DEVTOOLS_EXTENSION__']
  console.log(oldDevTools)
  // Do here whatever your script requires. For example:
  window['__REDUX_DEVTOOLS_EXTENSION__'] = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    connect: function (a: any, b: any, c: any, d: any) {
      console.log('init', a, b, c, d)
      return {
        send: function (action, state) {
          console.log('send', action, state)
        },
        subscribe: function (listener) {
          console.log('subscribe', listener)
        },
        unsubscribe: function () {
          console.log('unsubscribe')
        },
        init: function (state) {
          console.log('init', state)
        },
        error: function (message) {
          console.log('error', message)
        },
      }
    },
    send: function (action, state, options, instanceId) {
      console.log('send', action, state, options, instanceId)
    },
  }
}

function embed(fn: () => void) {
  const script = document.createElement('script')
  const target = document.head || document.documentElement
  script.id = 'wfpu'
  script.text = `(${fn.toString()})();`
  target.insertBefore(script, target.firstChild)
}

embed(codeToInject)

document.body.insertBefore(reactRoot, document.body.firstElementChild)

render(<WayfarerUltra />, reactRoot)
