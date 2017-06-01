import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { List, ListItem } from 'material-ui/List'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import PriorityHighIcon from 'material-ui/svg-icons/notification/priority-high'
import { red500, yellow500, green500 } from 'material-ui/styles/colors'

import DialogWithObject from '../../components/DialogWithObject'

import { setSumObjectVisibility, setHelloObjectVisibility, setLogVisited } from '../../actions'

function Logs ({ sumDialog, helloDialog, logs, dispatch }) {
  return (
    <div>
      <DialogWithObject
        open={sumDialog}
        object={{
          type: 'SUM',
          a: Math.floor((Math.random(10) * 10) + 1),
          b: Math.floor((Math.random(10) * 10) + 1)
        }}
        buttonLabel="Sum Object"
        visibilityFunction={setSumObjectVisibility}
      />
      <DialogWithObject
        open={helloDialog}
        object={{
          type: 'HELLO',
          value: 'What\'s your name?'
        }}
        buttonLabel="Hello Object"
        visibilityFunction={setHelloObjectVisibility}
      />
      <Table selectable={false} onCellClick={id => dispatch(setLogVisited(id))}>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn style={{ width: 150 }}>DATE</TableHeaderColumn>
            <TableHeaderColumn style={{ width: 100 }}>STATUS</TableHeaderColumn>
            <TableHeaderColumn>INPUT</TableHeaderColumn>
            <TableHeaderColumn>OUTPUT</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            (logs || []).map((log, i) => (
                <TableRow key={i} hoverable style={{ backgroundColor: log.visited ? 'white' : '#F5F5F5' }}>
                  <TableRowColumn style={{ width: 150 }}>
                    {moment(log.date).format('LLL')}
                  </TableRowColumn>
                  <TableRowColumn style={{ width: 100 }}>
                    {
                      log.status
                        ? <span style={{ color: 'green' }}>SUCCESS</span>
                        : <span style={{ color: 'red' }}>ERROR</span>
                    }
                  </TableRowColumn>
                    <TableRowColumn>
                      <pre>{JSON.stringify(log.in, null, 2)}</pre>
                    </TableRowColumn>
                    <TableRowColumn>
                      <pre>{JSON.stringify(log.out, null, 2)}</pre>
                </TableRowColumn>
                </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}

const mapStateToProps = (state) => ({
	sumDialog: state.sumObjectVisibility,
	helloDialog: state.helloObjectVisibility,
	logs: state.logs
})

export default connect(mapStateToProps)(Logs)