import cv2
import threading
import time
from multiprocessing import Process, Queue
import utils
import dispatch
import remote

methods = ['cv2.TM_CCOEFF', 'cv2.TM_CCOEFF_NORMED', 'cv2.TM_CCORR',
           'cv2.TM_CCORR_NORMED', 'cv2.TM_SQDIFF', 'cv2.TM_SQDIFF_NORMED']

config = {
    'camera_input': 0,
    'scale': 0.5,
    'blueLower': (0, 0, 0),
    'blueUpper': (255, 255, 255),
    'method': eval('cv2.TM_SQDIFF_NORMED'),
    'images_directory': './images',
    'templates': [],
    'not_found_threshold': 0.6,
    'period': 2
}

events = {
    'process': threading.Event(),
    'config': threading.Event()
}

cameras = {
    'process': None,
    'config': None
}

threads = {
    'process': None,
    'config': None
}

points_queue = Queue()
thresholds_queue = Queue()
thread_queue = Queue()
results_queue = Queue()
remove_templates_queue = Queue()


def remove_template_main(index):
    remove_templates_queue.put(index)


def add_to_queue(points):
    points_queue.put(points)


def adjust_hsv_main(action):
    thresholds_queue.put((
        (int(action['hsv']['minHue']), int(action['hsv']['minSaturation']), int(action['hsv']['minValue'])),
        (int(action['hsv']['maxHue']), int(action['hsv']['maxSaturation']), int(action['hsv']['maxValue']))
    ))


def the_other_thread(thread_name):
    if thread_name == 'config':
        return 'process'
    elif thread_name == 'process':
        return 'config'
    else:
        return None


def thread_loop(socket_io, thread_name):
    global config

    if not results_queue.empty():
        config = results_queue.get()

    # play.play_mode_on(thread_name)
    camera_input = config['camera_input']

    print thread_name

    cam = cv2.VideoCapture(camera_input)
    cam.set(3, 320)
    cam.set(4, 240)
    cam.set(5, 30)

    fps = 0
    current_time = int(round(time.time()))

    top_left = [0, 0]
    bottom_right = [0, 0]
    min_val = 0.0
    templates = [] if thread_name == 'config' else config['templates']
    analysis_array = []

    while not thread_queue.empty():
        ret_val, frame = cam.read()
        frame = cv2.resize(frame, (0, 0), fx=config['scale'], fy=config['scale'])
        if frame is None:
            break

        if not thresholds_queue.empty():
            config['blueLower'], config['blueUpper'] = thresholds_queue.get()

        frame = utils.image_operations(frame, config)

        if not points_queue.empty():
            points = points_queue.get()

            config['templates']\
                .append(frame[
                        (config['scale'] * int(points['startY'])/2):(config['scale'] * int(points['y'])/2),
                        (config['scale'] * int(points['startX'])/2):(config['scale'] * int(points['x'])/2)
                        ])

            temps = map(utils.return_image_base64, config['templates'])
            dispatch.update_templates(socket_io, temps)

        if not remove_templates_queue.empty():
            index = remove_templates_queue.get()
            del config['templates'][index]
            temps = map(utils.return_image_base64, config['templates'])
            dispatch.update_templates(socket_io, temps)

        if thread_name == 'process':
            for template in templates:
                top_left, bottom_right, min_val = \
                    utils.many_scales_match_template(template, frame, top_left, bottom_right, min_val, config)

            x = (top_left[0] + bottom_right[0]) / 2
            y = (top_left[1] + bottom_right[1]) / 2

            if min_val < 1.0:
                leanX = (80 - x) / config['scale']
                leanY = (60 - y) / config['scale']
                remote.receiver(socket_io, leanX, leanY)
                socket_io.emit(thread_name, {
                    'x': leanX,
                    'y': leanY
                })
                analysis_array.append({'timestamp': int(round(time.time() * 1000)), 'value': True})
                pass
            elif len(templates) > 0:
                analysis_array.append({'timestamp': int(round(time.time() * 1000)), 'value': False})
                pass

        if thread_name == 'config':
            b64 = utils.return_image_base64(frame)
            socket_io.emit(thread_name, b64)

        fps, current_time = utils.fps_counter(fps, current_time)
        object_found = utils.signal_analysis(analysis_array, config)

    cam.release()
    results_queue.put(config)


def clear_thread(thread_name):
    print 'cleaning', thread_name
    if not thread_queue.empty():
        thread_queue.get()
    if threads[thread_name] is not None and threads[thread_name].is_alive():
        # threads[thread_name].terminate()
        threads[thread_name].join()


def run_thread(socket_io, thread_name):
    print 'running', thread_name
    clear_thread(the_other_thread(thread_name))
    thread_queue.put(True)
    if threads[thread_name] is None or not threads[thread_name].is_alive():
        threads[thread_name] = Process(target=thread_loop, args=[socket_io, thread_name])
        threads[thread_name].start()
