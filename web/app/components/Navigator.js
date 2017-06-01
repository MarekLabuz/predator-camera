import React, { Component } from 'react'
import { browserHistory } from 'react-router'

import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import LibraryBooksIcon from 'material-ui/svg-icons/av/library-books'
import ChartIcon from 'material-ui/svg-icons/editor/show-chart'
import VideocamIcon from 'material-ui/svg-icons/av/videocam'

const pages = {
  '/': {
    text: 'Logs',
    icon: <LibraryBooksIcon />
  },
  '/chart': {
    text: 'Chart',
    icon: <ChartIcon />
  },
  '/config': {
    text: 'Configuration',
    icon: <VideocamIcon />
  }
}

class Navigator extends Component {
  constructor (props) {
    super(props)

    this.handleClose = this.handleClose.bind(this)

    this.state = {
      open: false,
      currentPage: pages[props.location.pathname]
    }
  }

  handleClose (page) {
    this.setState({
      open: false,
      currentPage: pages[page],
    })
    browserHistory.push(page)
  }

  render () {
    const { open, currentPage } = this.state
    return (
      <div style={{ marginBottom: 0 }}>
        <AppBar
          title={currentPage.text}
          onTitleTouchTap={() => this.setState({ open: true })}
          iconElementLeft={<IconButton>{currentPage.icon}</IconButton>}
        />
        <Drawer
          docked={false}
          width={230}
          open={open}
          onRequestChange={value => this.setState({ value })}
        >
          {
            Object.keys(pages).map(page => (
              <MenuItem
                key={page}
                leftIcon={pages[page].icon}
                onTouchTap={() => this.handleClose(page)}
                primaryText={pages[page].text}
              />
            ))
          }
        </Drawer>
      </div>
    )
  }
}

export default Navigator
