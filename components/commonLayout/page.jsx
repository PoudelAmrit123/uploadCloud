"use client"
import React from 'react'
import { Provider } from 'react-redux'
import store from '../../lib/store'

function CommonLayoutpage({children}) {
  return (
    <Provider store={store}>
        {children}

    </Provider>
  )
}

export default CommonLayoutpage