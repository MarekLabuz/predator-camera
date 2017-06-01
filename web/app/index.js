import injectTapEventPlugin from 'react-tap-event-plugin'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import App from './views/App'
import Logs from './views/Logs/Logs'
import CoordsSystem from './views/CoordsSystem/CoordsSystem'
import Stream from './views/Stream/Stream'
import store from './store'

injectTapEventPlugin()

const theme = {
  ...lightBaseTheme,
  fontFamily: 'Montserrat'
}

const app = document.getElementById('root')
ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Logs} />
          <Route path="chart" component={CoordsSystem} />
          <Route path="config" component={Stream} />
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  app)
