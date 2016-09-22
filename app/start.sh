#!/bin/bash

# Enable i2c
modprobe i2c-dev || true

while true; do
    node /usr/src/app/index.js
done
