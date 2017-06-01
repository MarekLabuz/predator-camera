export const SET_SUM_OBJECT_VISIBILITY = 'SET_SUM_OBJECT_VISIBILITY'
export const SET_HELLO_OBJECT_VISIBILITY = 'SET_HELLO_OBJECT_VISIBILITY'
export const RESPONSE = 'RESPONSE'
export const LOG_VISITED = 'LOG_VISITED'
export const SCALE_CHANGED = 'SCALE_CHANGED'
export const VIEW_ELEMENTS_CHANGED = 'VIEW_ELEMENTS_CHANGED'
export const VEHICLE_CONNECTED = 'VEHICLE_CONNECTED'
export const UPDATE_STATE_FROM_SERVER = 'UPDATE_STATE_FROM_SERVER'
export const ADJUST_HSV = 'ADJUST_HSV'
export const SET_TEMPLATES = 'SET_TEMPLATES'
export const SET_THRESHOLDS = 'SET_THRESHOLDS'
export const SET_WHEEL_ROTATION = 'SET_WHEEL_ROTATION'

export function setTemplates (templates) {
  return {
    type: SET_TEMPLATES,
    payload: {
      templates
    }
  }
}

export function adjustHSV (hsv) {
  return {
    type: ADJUST_HSV,
    payload: {
      hsv
    }
  }
}

export function updateStateFromServer (state) {
  return {
    type: UPDATE_STATE_FROM_SERVER,
    payload: {
      state
    }
  }
}

export function setSumObjectVisibility (visibility) {
  return {
    type: SET_SUM_OBJECT_VISIBILITY,
    payload: {
      visibility
    }
  }
}

export function setHelloObjectVisibility (visibility) {
  return {
    type: SET_HELLO_OBJECT_VISIBILITY,
    payload: {
      visibility
    }
  }
}

export function setLogVisited (id) {
  return {
    type: LOG_VISITED,
    payload: {
      id
    }
  }
}

export function changeScale (options) {
  return {
    type: SCALE_CHANGED,
    payload: {
      options
    }
  }
}

export function changeViewElements (options) {
  return {
    type: VIEW_ELEMENTS_CHANGED,
    payload: {
      options
    }
  }
}

export function setVehicleConnected (vehicleConnected) {
  return {
    type: VEHICLE_CONNECTED,
    payload: {
      vehicleConnected
    }
  }
}
