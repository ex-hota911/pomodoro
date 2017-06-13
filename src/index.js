import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import Time from './components/Time'
import reducer from './reducers'

const store = createStore(reducer)

render(
  <Provider store={store}>
	<Time time={10000}/>
  </Provider>,
  document.getElementById('root')
)
