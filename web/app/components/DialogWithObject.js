import React from 'react'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'

import { sendObject } from '../socket'

function DialogWithObject ({ open, object, buttonLabel, visibilityFunction, dispatch }) {
	const actions = [
		<FlatButton
			label="Cancel"
			primary={true}
			onTouchTap={() => dispatch(visibilityFunction(false))}
		/>,
		<FlatButton
			label="Send"
			primary={true}
			keyboardFocused={true}
			onTouchTap={() => {
				sendObject(object)
				dispatch(visibilityFunction(false))
			}}
		/>,
	]
	return (
		<span>
			<RaisedButton
				label={buttonLabel}
				primary={true}
				onMouseDown={() => dispatch(visibilityFunction(true))}
				style={{ margin: '5px 5px 0px 0px' }}
			/>
			<Dialog
				title="Object that is about to be sent to the server"
				actions={actions}
				modal={true}
				open={open}
			>
				<pre>
					{JSON.stringify(object, null, 2)}
				</pre>
			</Dialog>
		</span>
	)
}

export default connect()(DialogWithObject)
