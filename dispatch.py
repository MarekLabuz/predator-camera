def vehicle_connected(socket_io, data):
    socket_io.emit('dispatch', {
        'type': 'VEHICLE_CONNECTED',
        'payload': {
            'vehicleConnected': data
        }
    })


def update_templates(socket_io, data):
    socket_io.emit('dispatch', {
        'type': 'SET_TEMPLATES',
        'payload': {
            'templates': data
        }
    })


def update_thresholds(socket_io, thresholds, gear):
    socket_io.emit('dispatch', {
        'type': 'SET_THRESHOLDS',
        'payload': {
            'thresholds': thresholds,
            'gear': gear
        }
    })


def update_wheel_rotation(socket_io, data):
    socket_io.emit('dispatch', {
        'type': 'SET_WHEEL_ROTATION',
        'payload': {
            'rotation': data
        }
    })