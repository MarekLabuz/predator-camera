import wiringpi
import math
import dispatch

wiringpi.wiringPiSetupGpio()

wiringpi.pinMode(18, wiringpi.GPIO.PWM_OUTPUT)
wiringpi.pinMode(13, wiringpi.GPIO.PWM_OUTPUT)

wiringpi.pwmSetMode(wiringpi.GPIO.PWM_MODE_MS)

wiringpi.pwmSetClock(192)
wiringpi.pwmSetRange(2000)

wiringpi.pwmWrite(18, 150)
wiringpi.pwmWrite(13, 160)

current_p = 160
current_k = 150

borderOffset = 10

forward_speed = 172
backward_speed = 148

base_forward_border = 25
base_backward_border = -70

forward_border = base_forward_border
backward_border = base_backward_border

def receiver(socket_io, x, y):
    forward = False
    backward = False

    if y < backward_border:
        backward = True
        forward = False
    elif y > forward_border:
        forward = True
        backward = False
    else:
        forward = False
        backward = False

    lean = x / -160
    thresholds_changed, new_p, lean_changed, lean_eval = car_control(forward, backward, lean)
    if thresholds_changed:
        dispatch.update_thresholds(socket_io, {
            'forward': forward_border,
            'backward': backward_border
        }, 'D' if new_p == forward_speed else ('R' if new_p == backward_speed else 'N'))

    if lean_changed:
        dispatch.update_wheel_rotation(socket_io, (lean_eval / 150) * 60)


def car_control(forward, backward, lean):
    global k, current_p, current_k, forward_border, backward_border

    thresholds_changed = False
    lean_changed = False
    new_p = current_p
    new_k = current_k

    lean_eval = round((100 * lean)/10) * 10

    if forward:
        new_p = forward_speed
        new_k = (150 - lean_eval) if math.fabs(current_k - (150 - lean_eval)) > 10 else current_k
    elif backward:
        new_p = 160 if current_p == forward_speed else backward_speed
        new_k = (150 + lean_eval) if math.fabs(current_k - (150 + lean_eval)) > 10 else current_k
    else:
        new_p = 160
        new_k = (150 - lean_eval) if math.fabs(current_k - (150 - lean_eval)) > 10 else current_k

    if new_p != forward_speed and new_p != backward_speed and math.fabs(150 - new_k) >= 70:
        new_p = backward_speed
        new_k = 230 if lean > 0 else 70

    if new_p != current_p:
        current_p = new_p
        print 'new_p', new_p
        wiringpi.pwmWrite(13, int(new_p))
        if new_p == forward_speed:
            forward_border = base_forward_border - borderOffset
            backward_border = base_backward_border - borderOffset
        elif new_p == backward_speed:
            forward_border = base_forward_border + borderOffset
            backward_border = base_backward_border + borderOffset
        else:
            forward_border = base_forward_border + borderOffset
            backward_border = base_backward_border - borderOffset
        thresholds_changed = True

    if new_k != current_k:
        current_k = new_k
        print 'new_k', new_k
        wiringpi.pwmWrite(18, int(new_k))
        lean_changed = True

    return thresholds_changed, new_p, lean_changed, lean_eval

