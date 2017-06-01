import time
from socketIO_client import SocketIO, LoggingNamespace
from main import run_thread, clear_thread, add_to_queue, adjust_hsv_main, remove_template_main
import dispatch

socket_io = SocketIO('http://192.168.1.110:3000', 3000, LoggingNamespace)

dispatch.vehicle_connected(socket_io, True)


def run_thread_response(args):
    print 'run thread', args
    run_thread(socket_io, args)


def clear_thread_response(args):
    print 'clear thread', args
    clear_thread(args)


def add_points(args):
    add_to_queue(args)


def adjust_hsv(action):
    adjust_hsv_main(action)


def remove_template(index):
    remove_template_main(index)

socket_io.on('run_thread', run_thread_response)
socket_io.on('clear_thread', clear_thread_response)
socket_io.on('add_points', add_points)
socket_io.on('adjust_hsv', adjust_hsv)
socket_io.on('remove_template', remove_template)

try:
    socket_io.wait()
    while 1:
        time.sleep(1)
except (KeyboardInterrupt, SystemExit):
    dispatch.vehicle_connected(socket_io, False)
    print 'My job is done here...'
