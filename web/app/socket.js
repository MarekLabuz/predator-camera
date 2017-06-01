import _ from 'lodash'
import store from './store'
import { updateStateFromServer } from './actions'

const { dispatch } = store

const socket = io()

export function emit (action, message) {
  socket.emit(action, message)
}

export function addListener (action, func) {
  socket.on(action, func)
}

export function removeListener (action, func) {
  socket.removeListener(action, func)
}

export function sendObject (object) {
  socket.emit('action', object)
}

export const sendControl = _.debounce((map) => {
  socket.emit('control', map)
}, 100)

socket.on('updateStateFromServer', state => dispatch(updateStateFromServer(state)))
socket.on('dispatch', action => dispatch({
  ...action,
  doNotPropagate: true
}))

window.addEventListener('beforeunload', () => {
  emit('clear_thread', 'config')
  emit('clear_thread', 'process')
})
