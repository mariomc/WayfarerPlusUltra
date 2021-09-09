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

type WFPU = {
  extensionURL: string
}

type IconMarker = {
  url: string
}

type Marker = {
  icon: IconMarker
}

interface AngularElement {
  __ngContext__: any
}

type EnhancedElement = Element & AngularElement

declare const window: Window &
  typeof globalThis & {
    __REDUX_DEVTOOLS_EXTENSION__: DevToolsHook
    WFPU: WFPU
  }

const DEBUG = false

function codeToInject(wfpu: WFPU) {
  const monkeyPatch =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any


      (type: string, originalFn?: (...args: any[]) => any) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (...args: any[]) => {
        const result = originalFn?.(...args)
        if (DEBUG) console.log(type, args)

        if (type !== 'connect.subscribe') {
          const [action, state] = args

          window.postMessage(
            { sender: 'wfpu', type, action, state },
            window.location.origin,
          )
        }
        return result
      }

  const originalDevTools = window['__REDUX_DEVTOOLS_EXTENSION__'] || {}

  const devTools: DevToolsHook = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    connect: function (...args: any[]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any

      const returnValue = monkeyPatch(
        'connect',
        originalDevTools?.connect,
      )(...args)
      return {
        send: monkeyPatch('connect.send', returnValue?.send),
        subscribe: monkeyPatch('connect.subscribe', returnValue?.subscribe),
        unsubscribe: monkeyPatch(
          'connect.unsubscribe',
          returnValue?.unsubscribe,
        ),
        init: monkeyPatch('connect.init', returnValue?.init),
        error: monkeyPatch('connect.error', returnValue?.error),
      }
    },
    send: monkeyPatch('send', originalDevTools?.send),
  }

  function addLowestDistCircle(
    gMap: google.maps.Map,
    lat: number,
    lng: number,
  ) {
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

  const getElement = (selector: string): EnhancedElement | null => {
    return document.querySelector(selector)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getContext = (selector: string): any | null => {
    return getElement(selector)?.__ngContext__?.at?.(-1)
  }

  window.__REDUX_DEVTOOLS_EXTENSION__ = devTools
  window.WFPU = wfpu

  const modifyMarkers = (markers:Marker[], customIcon:string) => {
    return markers.map((marker: Marker) => ({
      ...marker,
      icon: {
        ...marker.icon,
        url: wfpu.extensionURL + customIcon,
      },
    }))
  }

  window.addEventListener('message', (ev) => {
    if (ev.origin !== location.origin) {
      console.log('not good origin')

      return
    }

    if (ev.data && ev.data.type === 'reviewCells') {
      const duplicateMap = getContext('app-check-duplicates nia-map')
      const accuracyMap = getContext('app-location-accuracy nia-map')
      const editMap = getContext('app-select-location-edit nia-map')

      // Add Precise Markers to nearby
      if (duplicateMap) {
        duplicateMap.markers.nearby.markers = modifyMarkers(
          duplicateMap.markers.nearby.markers,
          'icons/precise-marker.svg',
        )

        // Add Precise Markers to current
        duplicateMap.markers.default.markers = modifyMarkers(
          duplicateMap.markers.default.markers,
          'icons/precise-marker-green.svg',
        )
      }


      if (accuracyMap && accuracyMap.markers.default.markers) {
        accuracyMap.markers.default.markers = modifyMarkers(
          accuracyMap.markers.default.markers,
          'icons/precise-marker-green.svg',
        )
      }


      // Copy default markers to 2nd map
      if (accuracyMap && duplicateMap) {
        accuracyMap.markers.nearby = duplicateMap.markers.nearby
      }

      if (editMap) {
        editMap.markers.default.markers = modifyMarkers(
          editMap.markers.default.markers,
          'icons/precise-marker.svg',
        )
      }

      // Add Controls
      Array.from(
        document.querySelectorAll('nia-map') as NodeListOf<EnhancedElement>,
      ).forEach((map: EnhancedElement) => {
        const c = map.__ngContext__.at(-1).componentRef
        c.showMapTypeControl =
          c.showRotateControl =
          c.showStreetViewControl =
          c.showZoomControl =
            true
      })

      // Cells
      Array.from(
        document.querySelectorAll('agm-map') as NodeListOf<EnhancedElement>,
      ).forEach((map) => {
        const c = map.__ngContext__[8]
        c.updateS2CellLevel(17)
      })

      // circle to check duplicates
      const ref1 = duplicateMap?.componentRef
      if (ref1) {
        addLowestDistCircle(
          ref1.map,
          ref1.markers.default.markers[0].latitude,
          ref1.markers.default.markers[0].longitude,
        )
      }

      // circle to check duplicates
      const ref2 = accuracyMap?.componentRef
      if (ref2) {
        const target = ref2.markers.default || ref2.markers.suggested
        addLowestDistCircle(
          ref2.map,
          target.markers[0].latitude,
          target.markers[0].longitude,
        )
      }
    }
  })
}

export const embed = (fn: (wfppu: WFPU) => void): void => {
  const Wfpu: WFPU = { extensionURL: browser.runtime.getURL('') }
  const script = document.createElement('script')
  const target = document.head || document.documentElement
  script.id = 'wfpu'
  script.text = `(${fn.toString()})(${JSON.stringify(Wfpu, null, 4)});`
  target.insertBefore(script, target.firstChild)
}

export const hook = (): void => {
  embed(codeToInject)
}
