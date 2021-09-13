import React, { useEffect, useReducer } from 'react'

import { NavBar } from './navbar'
import { AppContext } from '../state'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: any, action: any) {
  if (action.state) {
    return action.state
  }
  return state
}

const initialState = {}

export const WayfarerUltra = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const handler = function ({
      data,
      origin,
    }: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      origin: any
    }) {
      if (location.origin !== origin) {
        return
      }
      dispatch(data)
    }
    window.addEventListener('message', handler)

    return () => {
      window.removeEventListener('message', handler)
    }
  }, [])

  return (
    <AppContext.Provider value={state}>
      <NavBar />
    </AppContext.Provider>
  )
}
