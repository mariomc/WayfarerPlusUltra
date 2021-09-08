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

function codeToInject(WFPU) {
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

  function addLowestDistCircle(gMap, lat, lng) {
    const latLng = new google.maps.LatLng(lat, lng)
    const c = new google.maps.Circle({
      map: gMap,
      center: latLng,
      radius: 20,
      strokeColor: 'red',
      fillColor: 'red',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillOpacity: 0.2,
    })
    return c
  }

  window.__REDUX_DEVTOOLS_EXTENSION__ = devTools
  window.WFPU = WFPU

  window.addEventListener('message', (ev) => {
    if (ev.origin !== location.origin) {
      console.log('not good origin')

      return
    }

    if (ev.data && ev.data.type === 'reviewCells') {
      const map1 = document.querySelector('app-check-duplicates nia-map')
      const map2 = document.querySelector('app-location-accuracy nia-map')
      const map1Ctx = map1.__ngContext__.at(-1)
      const map2Ctx = map2.__ngContext__.at(-1)

      // Add Precise Markers
      map1Ctx.markers.nearby.markers = map1Ctx.markers.nearby.markers.map(
        (marker) => ({
          ...marker,
          icon: {
            ...marker.icon,
            url: WFPU.extensionURL + 'icons/precise-marker.svg',
          },
        }),
      )
      map1Ctx.markers.default.markers = map1Ctx.markers.default.markers.map(
        (marker) => ({
          ...marker,
          icon: {
            ...marker.icon,
            url: WFPU.extensionURL + 'icons/precise-marker-green.svg',
          },
        }),
      )

      map2Ctx.markers.nearby = map1Ctx.markers.nearby

      // Controls
      Array.from(document.querySelectorAll('nia-map')).forEach((map) => {
        const i = map.__ngContext__.length - 1
        const c = map.__ngContext__[i].componentRef
        c.showMapTypeControl =
          c.showRotateControl =
          c.showStreetViewControl =
          c.showZoomControl =
            true
      })

      // Cells
      Array.from(document.querySelectorAll('agm-map')).forEach((map) => {
        const c = map.__ngContext__[8]
        c.updateS2CellLevel(17)
      })
      // circle to check duplicates

      const ref1 = map1Ctx.componentRef
      addLowestDistCircle(
        ref1.map,
        ref1.markers.default.markers[0].latitude,
        ref1.markers.default.markers[0].longitude,
      )

      // circle to check duplicates
      const ref2 = map2Ctx.componentRef
      const target = ref2.markers.default || ref2.markers.suggested
      addLowestDistCircle(
        ref2.map,
        target.markers[0].latitude,
        target.markers[0].longitude,
      )
    }
  })
}

export const embed = (fn: () => void): void => {
  const WFPU = { extensionURL: browser.runtime.getURL('') }
  const script = document.createElement('script')
  const target = document.head || document.documentElement
  script.id = 'wfpu'
  script.text = `(${fn.toString()})(${JSON.stringify(WFPU, null, 4)});`
  target.insertBefore(script, target.firstChild)
}

export const hook = (): void => {
  embed(codeToInject)
}
