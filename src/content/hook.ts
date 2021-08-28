type DevToolsConnect = {
  send: () => void
  subscribe: () => void
  unsubscribe: () => void
  init: () => void
  error: () => void
}

type DevToolsHook = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connect: (a: any, b: any, c: any, d: any) => DevToolsConnect
  send: () => void
}

declare const window: Window &
  typeof globalThis & {
    __REDUX_DEVTOOLS_EXTENSION__: DevToolsHook
  }

const DEBUG = false

function codeToInject() {
  // const oldDevTools = window['__REDUX_DEVTOOLS_EXTENSION__']
  const sendMessage =
    (type: string) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any[]) => {
      if (DEBUG) console.log(type, args)
      if (type === 'connect.subscribe') {
        return
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [action, state] = args

      window.postMessage(
        { sender: 'wfpu', type, action, state },
        window.location.origin,
      )
    }
  const devTools: DevToolsHook = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    connect: function (a: any, b: any, c: any, d: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sendMessage('connect')(a, b, c, d)
      return {
        send: sendMessage('connect.send'),
        subscribe: sendMessage('connect.subscribe'),
        unsubscribe: sendMessage('connect.unsubscribe'),
        init: sendMessage('connect.init'),
        error: sendMessage('connect.error'),
      }
    },
    send: sendMessage('send'),
  }

  window.__REDUX_DEVTOOLS_EXTENSION__ = devTools
}

export const embed = (fn: () => void): void => {
  const script = document.createElement('script')
  const target = document.head || document.documentElement
  script.id = 'wfpu'
  script.text = `(${fn.toString()})();`
  target.insertBefore(script, target.firstChild)
}

export const hook = (): void => {
  embed(codeToInject)
}
