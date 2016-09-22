#!/bin/env node

{
    'use strict';
    const i2c = require('i2c');
    const async = require('async');
    const debug = require('debug')('ht16k33');

    let ht16k33 = function() {
        if (!(this instanceof ht16k33)) return new ht16k33();
        this.address = (process.env.LED_MATRIX_I2C_ADDRESS == null) ? 0x70 : parseInt(process.env.LED_MATRIX_I2C_ADDRESS);
        this.brightness = 15;
        this.bus = (process.env.LED_MATRIX_I2C_BUS == null) ? '/dev/i2c-1' : process.env.LED_MATRIX_I2C_BUS;
        this.write_buffer = [];
        this.current_array = [];
        this.wire = new i2c(this.address, {
            device: this.bus
        });
    }

    ht16k33.prototype.init = function() {
        let self = this;

        self.wire.write(Buffer([(0x20 | 0x01)]), (err) => {

        }); // enable oscillator
        self.wire.write(Buffer([(0x01 | 0x80)]), (err) => {

        }); // set brightness
        for (var x = 0; x < 16; x++) {
            self.wire.write(Buffer([x, 0]), (err) => {
                debug(err)
            });
        } // clear display
    };

    ht16k33.prototype.setLED = function(y, x, value) {
        let self = this;
        var led = y * 16 + ((x + 7) % 8);

        var pos = Math.floor(led / 8);
        var offset = led % 8;


        if (value)
            self.write_buffer[pos] |= (1 << offset);
        else
            self.write_buffer[pos] &= ~(1 << offset);
    }

    ht16k33.prototype.writeArray = function(_array) {
        let self = this;
        self.current_array = _array;
        self.clearBuffer();

        var x = 0;
        var y = 0;

        for (var i in _array) {
            self.setLED(y, x, _array[i]);

            x++;

            if (x >= 8) {
                y++;
                x = 0;
            }

        }

        self.writeBuffer();
    }

    ht16k33.prototype.writeAnimation = function(_array, speed) {

        var self = this;
        var old_buffer = self.write_buffer.slice();

        for (var i in _array) {
            self.writeAnimation2(i, _array[i], speed);
        }

        setTimeout(function() {

            self.clearBuffer();
            self.writeBuffer();

        }, _array.length * speed + speed);

        setTimeout(function() {

            self.write_buffer = old_buffer.slice();
            self.writeBuffer();

        }, _array.length * speed + 1000);
    }

    ht16k33.prototype.writeAnimation2 = function(i, data, speed) {

        var self = this;

        setTimeout(function() {
            self.writeArray(data);
        }, speed * i);
    }

    ht16k33.prototype.writeBuffer = function() {
        let self = this;
        for (var i in self.write_buffer) {
            self.wire.write(Buffer([i, self.write_buffer[i]]), (err) => {
                if (err) {

                }
            });
        }
    }

    ht16k33.prototype.clearBuffer = function() {
        let self = this;
        for (var i in self.write_buffer) {
            self.write_buffer[i] = 0;
        }
    }


    module.exports = ht16k33();
}
