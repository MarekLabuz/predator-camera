import React, { Component, PropTypes } from 'react'

import CircularProgress from 'material-ui/CircularProgress'

import PaperControl from './PaperControl'

import start from './draw'
import { emit, addListener, removeListener } from '../../socket'
import { adjustHSV } from '../../actions'

import style from './Stream.scss'

const sliderConfig = {
  step: 1,
  style: { width: 150, margin: '0px 20px' }
}

class Stream extends Component {
  constructor () {
    super()

    this.handleSliderChange = this.handleSliderChange.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleAddPoints = this.handleAddPoints.bind(this)

    this.state = {
      frame: ''
    }
  }

  componentDidMount () {
    start(this.handleAddPoints)
    addListener('config', this.handleUpdate)
    emit('run_thread', 'config')
  }

  componentWillUnmount () {
    removeListener('config', this.handleUpdate)
    emit('clear_thread', 'config')
  }

  handleAddPoints (points) {
    emit('add_points', points)
  }

  handleSliderChange (property, value) {
    const { dispatch, hsv } = this.props
    dispatch(adjustHSV({
      ...hsv,
      [property]: value
    }))
  }

  handleUpdate (frame) {
    this.setState({
      frame
    })
  }

  render () {
    const { frame } = this.state
    const { hsv: { minHue, maxHue, minSaturation, maxSaturation, minValue, maxValue }, templates } = this.props
    return (
      <div>
        <canvas id="canvas" width="640" height="480" className={style.canvas} />
        {
          !frame
            ? <CircularProgress className={style.loading} />
            :
              <img
                id="stream"
                alt="frame"
                width="640"
                src={frame}
                className={style.img}
              />
        }
        <div className={style.templates}>
          {
              templates.map((template, i) => (
                <img
                  id={`template-${i}`}
                  alt={`template-${i}`}
                  src={template}
                  onClick={() => emit('remove_template', i)}
                />
              ))
            }
        </div>
        <div className={style.sidePanel}>
          <div>
            <PaperControl
              header="Hue (HSV)"
              paperStyle={{ marginBottom: 20 }}
              sliderConfig={sliderConfig}
              minValue={minHue}
              maxValue={maxHue}
              max={180}
              onChangeMin={(e, value) => this.handleSliderChange('minHue', value)}
              onChangeMax={(e, value) => this.handleSliderChange('maxHue', value)}
            />
            <PaperControl
              header="Saturation (HSV)"
              paperStyle={{ marginBottom: 20 }}
              sliderConfig={sliderConfig}
              minValue={minSaturation}
              maxValue={maxSaturation}
              max={255}
              onChangeMin={(e, value) => this.handleSliderChange('minSaturation', value)}
              onChangeMax={(e, value) => this.handleSliderChange('maxSaturation', value)}
            />
            <PaperControl
              header="Value (HSV)"
              sliderConfig={sliderConfig}
              minValue={minValue}
              maxValue={maxValue}
              max={255}
              onChangeMin={(e, value) => this.handleSliderChange('minValue', value)}
              onChangeMax={(e, value) => this.handleSliderChange('maxValue', value)}
            />
          </div>
        </div>
      </div>
    )
  }
}

Stream.propTypes = {
  dispatch: PropTypes.func,
  hsv: PropTypes.object
}

export default Stream
