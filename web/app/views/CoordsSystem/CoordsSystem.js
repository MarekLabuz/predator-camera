import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import cx from 'classnames'

import ControlPanel from './ControlPanel/ControlPanel'

import { emit, addListener, removeListener } from '../../socket'

import style from './CoordsSystem.scss'

const getStyle = (rotation = 0) => ({ transform: `scale(0.5) translate(-100%, -50%) rotate(${rotation}deg)` })

class CoordsSystem extends Component {
  constructor () {
    super()

    this.updateCoords = this.updateCoords.bind(this)

    this.horizontalData = []
    this.verticalData = []
  }

  componentDidMount () {
    addListener('process', this.updateCoords)
    emit('run_thread', 'process')

    this.vis = d3.select('#visualisation')
    this.vis.call(d3.drag().on('drag', this.dragStarted))
    this.WIDTH = window.innerWidth // eslint-disable-line
    this.HEIGHT = 500
    this.MARGINS = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 50
    }

    const xScale = d3.scaleLinear().range([this.MARGINS.left, this.WIDTH - this.MARGINS.right]).domain([0, 100])
    this.yScale = d3.scaleLinear().range([this.HEIGHT - this.MARGINS.top, this.MARGINS.bottom]).domain([-200, 200])
    const xAxis = d3.axisBottom().scale(xScale)
    const yAxis = d3.axisLeft().scale(this.yScale)
    this.vis.append('svg:g')
      .attr('class', 'xaxis')
      .attr('transform', `translate(0, ${this.HEIGHT - this.MARGINS.bottom})`)
      .call(xAxis)

    this.vis.append('svg:g')
    .attr('transform', `translate(${this.MARGINS.left}, 0)`, 0)
    .call(yAxis)

    const lineGen = d3.line()
      .x(d => xScale(d.miliseconds))
      .y(d => this.yScale(d.altitude))
      .curve(d3.curveMonotoneX)

    this.vis.append('svg:path')
      .attr('d', lineGen([]))
      .attr('class', 'horizontal-altitude')
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .attr('fill', 'none')

    this.vis.append('svg:path')
      .attr('d', lineGen([]))
      .attr('class', 'vertical-altitude')
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('fill', 'none')

    this.vis.append('svg:path')
      .attr('d', lineGen([]))
      .attr('class', 'horizontal-altitude-top-threshold')
      .attr('stroke', 'red')
      .attr('stroke-width', 1)
      .attr('fill', 'none')

    this.vis.append('svg:path')
      .attr('d', lineGen([]))
      .attr('class', 'horizontal-altitude-bottom-threshold')
      .attr('stroke', 'red')
      .attr('stroke-width', 1)
      .attr('fill', 'none')

    this.vis.append('text')
      .attr('class', 'y label')
      .attr('text-anchor', 'end')
      .attr('y', 55)
      .attr('x', -20)
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text('deviation')

    this.vis.append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'end')
      .attr('x', this.WIDTH - 300)
      .attr('y', this.HEIGHT - 25)
      .text('time')
  }

  componentWillUnmount () {
    removeListener('process', this.updateCoords)
    emit('clear_thread', 'process')
  }

  updateCoords (data) {
    const { x, y, beginFrom } = data
    this.horizontalData = this.horizontalData.concat([{ miliseconds: beginFrom, altitude: x }]).slice(-100)
    this.verticalData = this.verticalData.concat([{ miliseconds: beginFrom, altitude: y }]).slice(-100)

    const { vertical: verticalVisible, horizontal: horizontalVisible, thresholds } = this.props

    const xScale = d3
      .scaleLinear()
      .range([this.MARGINS.left, this.WIDTH - this.MARGINS.right])
      .domain([this.horizontalData[0].miliseconds, _.last(this.horizontalData).miliseconds])

    const xAxis = d3.axisBottom().scale(xScale)

    const lineGen = d3.line()
      .x(d => xScale(d.miliseconds))
      .y(d => this.yScale(d.altitude))
      .curve(d3.curveMonotoneX)

    const horizontalAltitudeTopThreshold = d3.line()
      .x(d => xScale(d.miliseconds))
      .y(() => this.yScale(thresholds.forward))

    const horizontalAltitudeBottomThreshold = d3.line()
      .x(d => xScale(d.miliseconds))
      .y(() => this.yScale(thresholds.backward))

    this.vis.select('.horizontal-altitude')
      .style('opacity', horizontalVisible ? 1 : 0)
      .attr('d', lineGen(this.horizontalData))

    this.vis.select('.vertical-altitude')
      .style('opacity', verticalVisible ? 1 : 0)
      .attr('d', lineGen(this.verticalData))

    this.vis.select('.horizontal-altitude-top-threshold')
      .style('opacity', horizontalVisible ? 1 : 0)
      .attr('d', horizontalAltitudeTopThreshold(this.horizontalData))

    this.vis.select('.horizontal-altitude-bottom-threshold')
      .style('opacity', horizontalVisible ? 1 : 0)
      .attr('d', horizontalAltitudeBottomThreshold(this.horizontalData))

    this.vis.select('.xaxis')
      .call(xAxis)
  }

  render () {
    const { wheelRotation, gear } = this.props
    return (
      <div>
        <ControlPanel onToggle={this.handleToggle} {...this.props} />
        <div className={style.container}>
          <div className={style.imageContainer}>
            <img alt="" src="images/car_drawing.png" className={cx(style.image, style.body)} style={getStyle()} />
            <img alt="" src="images/wheel.png" className={cx(style.image, style.wheel1)} style={getStyle(wheelRotation)} />
            <img alt="" src="images/wheel.png" className={cx(style.image, style.wheel2)} style={getStyle(wheelRotation)} />
            <div className={style.gear} style={{ color: gear === 'R' ? 'red' : 'black' }}>{gear}</div>
          </div>
          <svg className={style.chart} id="visualisation" height="500" />
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return state.viewElements
}

export default connect(mapStateToProps)(CoordsSystem)
