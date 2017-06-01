import pyaudio
import wave
import threading

CHUNK = 1024

play_event = threading.Event()
play_event.set()

currently_playing_file = ''


def play_sound(filename):
    p = pyaudio.PyAudio()
    wf = wave.open(filename, 'rb')
    stream = p.open(format=p.get_format_from_width(wf.getsampwidth()),
                    channels=wf.getnchannels(),
                    rate=wf.getframerate(),
                    output=True)

    data = wf.readframes(CHUNK)

    while data != '' and play_event.is_set():
        stream.write(data)
        data = wf.readframes(CHUNK)

    stream.stop_stream()
    stream.close()
    p.terminate()

playSoundThread = threading.Thread(target=play_sound, args=['./wav_files/not_found_en.wav'])


def rest_currently_playing_file():
    global currently_playing_file
    currently_playing_file = ''


def start_playing(filename):
    global currently_playing_file, playSoundThread

    if currently_playing_file != filename:
        currently_playing_file = filename

        if playSoundThread.is_alive():
            play_event.clear()
            playSoundThread.join()

        playSoundThread = threading.Thread(target=play_sound, args=[filename])
        play_event.set()
        playSoundThread.start()


def play_not_found():
    start_playing('./wav_files/not_found_en.wav')


def play_mode_on(mode):
    if mode == 'process':
        start_playing('./wav_files/process_mode_on_en.wav')
    elif mode == 'config':
        start_playing('./wav_files/config_mode_on_en.wav')


def play_process_mode_on():
    start_playing('./wav_files/process_mode_on_en.wav')


def play_config_mode_on():
    start_playing('./wav_files/config_mode_on_en.wav')
