import _ from 'lodash'

import {
  SET_SUM_OBJECT_VISIBILITY,
  SET_HELLO_OBJECT_VISIBILITY,
  RESPONSE,
  LOG_VISITED,
  SCALE_CHANGED,
  VIEW_ELEMENTS_CHANGED,
  VEHICLE_CONNECTED,
  UPDATE_STATE_FROM_SERVER,
  ADJUST_HSV,
  SET_TEMPLATES,
  SET_THRESHOLDS,
  SET_WHEEL_ROTATION
} from './actions'

export const initialState = {
  sumObjectVisibility: false,
  helloObjectVisibility: false,
  scale: {
    step: 7,
    textStep: 20
  },
  viewElements: {
    vertical: true,
    horizontal: true,
    thresholds: { forward: 0, backward: 0 },
    wheelRotation: 0,
    gear: 'N'
  },
  vehicleConnected: false,
  hsv: {
    minHue: 0,
    maxHue: 180,
    minSaturation: 0,
    maxSaturation: 255,
    minValue: 0,
    maxValue: 255
  },
  templates: []
}

function app (state = initialState, action) {
  switch (action.type) {
    case UPDATE_STATE_FROM_SERVER:
      return _.merge({}, state, action.payload.state)
    case SET_SUM_OBJECT_VISIBILITY:
      return {
        ...state,
        sumObjectVisibility: action.payload.visibility
      }
    case SET_HELLO_OBJECT_VISIBILITY:
      return {
        ...state,
        helloObjectVisibility: action.payload.visibility
      }
    case RESPONSE:
      return {
        ...state,
        logs: [
          {
            status: action.payload.status,
            in: action.payload.in,
            out: action.payload.out,
            date: new Date(),
            visited: false
          },
          ...(state.logs || [])
        ]
      }
    case LOG_VISITED:
      return {
        ...state,
        logs: [
          ...state.logs.slice(0, action.payload.id),
          {
            ...state.logs[action.payload.id],
            visited: true
          },
          ...state.logs.slice(action.payload.id + 1)
        ]
      }
    case SCALE_CHANGED:
      return {
        ...state,
        scale: {
          ...state.scale,
          ...action.payload.options
        }
      }
    case VIEW_ELEMENTS_CHANGED:
      return {
        ...state,
        viewElements: {
          ...state.viewElements,
          ...action.payload.options
        }
      }
    case VEHICLE_CONNECTED:
      return {
        ...state,
        vehicleConnected: action.payload.vehicleConnected
      }
    case ADJUST_HSV:
      return {
        ...state,
        hsv: {
          ...state.hsv,
          ...action.payload.hsv
        }
      }
    case SET_TEMPLATES:
      return {
        ...state,
        templates: action.payload.templates
      }
    case SET_THRESHOLDS:
      return {
        ...state,
        viewElements: {
          ...state.viewElements,
          thresholds: action.payload.thresholds,
          gear: action.payload.gear
        }
      }
    case SET_WHEEL_ROTATION:
      return {
        ...state,
        viewElements: {
          ...state.viewElements,
          wheelRotation: action.payload.rotation,
        }
      }
    default:
      return state
  }
}

export default app
