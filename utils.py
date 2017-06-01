import time
import cv2
import os
import stat
import base64
import numpy as np


def fps_counter(fps, current_time):
    inner_fps = fps + 1
    inner_current_time = current_time

    now = int(round(time.time() * 1000))
    if now - inner_current_time >= 1000:
        print 'FPS', inner_fps
        inner_current_time = now
        inner_fps = 0

    return inner_fps, inner_current_time


def signal_analysis(analysis_array, config):
    if len(analysis_array) == 0:
        return True
    period = config['period']
    not_found_threshold = config['not_found_threshold']
    now = int(round(time.time() * 1000))
    filtered_analysis_array = filter(lambda x: x['timestamp'] >= now - period * 1000, analysis_array)
    filtered_analysis_array_only_positive = filter(lambda x: x['value'], filtered_analysis_array)
    return \
        float(len(filtered_analysis_array_only_positive)) / float(len(filtered_analysis_array)) >= not_found_threshold


def max_rgb_filter(image):
    (B, G, R) = cv2.split(image)

    M = np.maximum(np.maximum(R, G), B)
    R[R < M] = 0
    G[G < M] = 0
    B[B < M] = 0

    return cv2.merge([B, G, R])


def image_operations(image, config):

    # hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    # low = np.array([90, 0, 0])
    # high = np.array([130, 255, 230])
    # mask = cv2.inRange(hsv, low, high)

    inner_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(inner_image, config['blueLower'], config['blueUpper'])
    mask = cv2.erode(mask, None, iterations=3)
    mask = cv2.dilate(mask, None, iterations=3)

    res = cv2.bitwise_and(inner_image, inner_image, mask=mask)

    # res = cv2.cvtColor(res, cv2.COLOR_HSV2BGR)
    # res = max_rgb_filter(res)
    # res = cv2.Canny(res, 50, 200)
    # res = max_rgb_filter(res)
    return res


def many_scales_match_template(template, frame, in_top_left, in_bottom_right, in_min, config):
    top_left = in_top_left
    bottom_right = in_bottom_right
    min_val = in_min

    # (0.8, 1.2, 10)
    for scale in np.linspace(1.0, 1.2, 1):
        resized_frame = cv2.resize(frame, (0, 0), fx=scale, fy=scale)
        top_left, bottom_right, min_val = match_template(template, resized_frame, top_left, bottom_right, min_val, config)

    return top_left, bottom_right, min_val


def match_template(template, frame, in_top_left, in_bottom_right, in_min, config):
    h, w, c = template.shape[::]

    result_image = cv2.matchTemplate(frame, template, config['method'])
    min_val, max_val, min_top_left, max_top_left = cv2.minMaxLoc(result_image)

    top_left = min_top_left
    bottom_right = (top_left[0] + w, top_left[1] + h)

    if min_val <= min:
        return top_left, bottom_right, min_val
    else:
        return in_top_left, in_bottom_right, in_min


def read_images_from_directory(directory):
    images = []
    images_paths = []
    for image_path in os.listdir(directory):
        absolute_image_path = os.path.join(directory, image_path)
        os.chmod(absolute_image_path, stat.S_IRUSR | stat.S_IRGRP | stat.S_IROTH | stat.S_IWUSR | stat.S_IWGRP | stat.S_IWOTH | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
        images_paths.append(absolute_image_path)

    for image_path in images_paths:
        print image_path
        images.append(cv2.imread(image_path, 0))

    return images


def return_image_base64(image):
    img = image.copy()
    cnt = cv2.imencode('.png', img)[1]
    b64 = base64.encodestring(cnt)
    return 'data:image/png;base64,' + b64
