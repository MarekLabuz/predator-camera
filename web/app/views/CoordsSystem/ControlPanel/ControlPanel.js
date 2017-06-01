import React, { Component } from 'react'

import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import Toggle from 'material-ui/Toggle'
import Subheader from 'material-ui/Subheader'

import { changeViewElements } from '../../../actions'

class ControlPanel extends Component {
  constructor () {
    super()

    this.handleToggle = this.handleToggle.bind(this)
  }

  handleToggle (line, e, value) {
    const { dispatch } = this.props
    dispatch(changeViewElements({
      [line]: value
    }))
  }

  render () {
    const { vertical, horizontal } = this.props
    return (
      <div>
        <IconMenu
          style={{ position: 'absolute', right: 0, top: 70 }}
          iconButtonElement={<IconButton><SettingsIcon /></IconButton>}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          menuStyle={{ paddingBottom: 10 }}
        >
          <Subheader>Settings</Subheader>
          <MenuItem disabled style={{ padding: '5px 16px', cursor: 'default' }}>
            <Toggle
              value={vertical}
              label="Vertical"
              onToggle={(...v) => this.handleToggle('vertical', ...v)}
              defaultToggled={vertical}
            />
          </MenuItem>
          <MenuItem disabled style={{ padding: '5px 16px', cursor: 'default' }}>
            <Toggle
              value={horizontal}
              label="Horizontal"
              onToggle={(...v) => this.handleToggle('horizontal', ...v)}
              defaultToggled={horizontal}
            />
          </MenuItem>
        </IconMenu>
      </div>
    )
  }
}

export default ControlPanel
