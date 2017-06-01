#!/bin/bash

eval "sudo rm -rf /dev/video0"
eval "sudo mknod /dev/video0 c 81 0"
eval "sudo chmod 777 /dev/video0"
eval "sudo service motion stop"
