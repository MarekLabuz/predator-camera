import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import CircularProgress from 'material-ui/CircularProgress'

import Navigator from '../components/Navigator'

function App ({ children, vehicleConnected, location, ...otherProps }) {
  return (
    <div>
      <div>
        <Navigator location={location} />
        {
          React.cloneElement(children, {
            ...otherProps
          })
        }
      </div>
      {
        !vehicleConnected
          ?
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                top: 0,
                position: 'fixed',
                width: '100%',
                height: '100%',
                zIndex: 10000,
                color: 'white',
                fontSize: 30
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <CircularProgress color="white" />
                Waiting for a vehicle
              </div>
            </div>
          : null
      }
    </div>
  )
}

App.propTypes = {
  children: PropTypes.node,
  vehicleConnected: PropTypes.bool,
  location: PropTypes.object
}

function mapStateToProps (state) {
  return {
    vehicleConnected: state.vehicleConnected,
    hsv: state.hsv,
    templates: state.templates
  }
}

export default connect(mapStateToProps)(App)
