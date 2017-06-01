import _ from 'lodash'
import express from 'express'
import history from 'connect-history-api-fallback'
import webpack from 'webpack'
import http from 'http'
import socketIO from 'socket.io'

import config from './webpack.config'
import reducer, { initialState } from './app/reducers'

const PORT = 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const compiler = webpack(config)

let state = initialState

let beginFrom = 0

io.on('connection', (socket) => {
  socket.emit('updateStateFromServer', state)
  socket.on('process', (msg) => {
    const { x, y } = msg

    io.emit('process', { x, y, beginFrom })
    beginFrom += 1
  })
  socket.on('config', (msg) => {
    io.emit('config', msg)
  })
  socket.on('run_thread', (msg) => {
    io.emit('run_thread', msg)
  })
  socket.on('clear_thread', (msg) => {
    io.emit('clear_thread', msg)
  })
  socket.on('remove_template', (msg) => {
    io.emit('remove_template', msg)
  })
  socket.on('dispatch', (action) => {
    state = reducer(state, action)
    socket.broadcast.emit('dispatch', action)
    if (action.type === 'ADJUST_HSV') {
      socket.broadcast.emit('adjust_hsv', action.payload)
    }
  })
  socket.on('add_points', (points) => {
    io.emit('add_points', points)
  })

app.use(history({
  index: '/index.html'
}))

app.use(express.static('static'))

app.use(require('webpack-dev-middleware')(compiler, {
  onInfo: true,
  publicPath: config.output.publicPath
}))

server.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log(`Listening on port: ${PORT}`)
  }
})
