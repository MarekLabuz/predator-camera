import React, { PropTypes } from 'react'
import Slider from 'material-ui/Slider'
import Paper from 'material-ui/Paper'

function PaperControl ({ paperStyle, header, sliderConfig, minValue, maxValue, min, max, onChangeMin, onChangeMax }) {
  return (
    <Paper
      zDepth={2}
      style={{ padding: 20, width: 300, height: 'auto', ...paperStyle }}
    >
    <h3 style={{ textAlign: 'center' }}>{header}</h3>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      MIN
      <div style={{ height: 65 }}>
        <Slider
          {...sliderConfig}
          min={0}
          max={max}
          value={minValue}
          onChange={onChangeMin}
        />
      </div>
      {minValue}
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      MAX
      <div style={{ height: 65 }}>
        <Slider
          {...sliderConfig}
          min={0}
          max={max}
          value={maxValue}
          onChange={onChangeMax}
        />
      </div>
      {maxValue}
    </div>
    </Paper>
  )
}

PaperControl.propTypes = {
  paperStyle: PropTypes.object,
  header: PropTypes.string,
  sliderConfig: PropTypes.object,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  onChangeMin: PropTypes.func,
  onChangeMax: PropTypes.func
}

export default PaperControl
