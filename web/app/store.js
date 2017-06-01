import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'

import app from './reducers'
import { emit } from './socket'
import { UPDATE_STATE_FROM_SERVER, VIEW_ELEMENTS_CHANGED } from './actions'

const excludeActions = [UPDATE_STATE_FROM_SERVER, VIEW_ELEMENTS_CHANGED]

const stateSyncMiddleware = store => dispatch => (action) => { // eslint-disable-line
  if (!excludeActions.includes(action.type) && !action.doNotPropagate) {
    emit('dispatch', action)
  }
  return dispatch(action)
}

const logger = createLogger({
  collapsed: true,
  duration: true,
  timestamp: false
})

const store = createStore(app, applyMiddleware(stateSyncMiddleware, logger))

export default store
