#!/bin/env node

{
    'use strict';
    const request = require('request');
    const debug = require('debug')('artik');
    // Setting credentials from environmental variables
    const device_id = process.env.ARTIKCLOUD_DEVICE_ID || null; // Required
    const device_token = process.env.ARTIKCLOUD_DEVICE_TOKEN || null; // Required

    let artikCloud = function() {
        if (!(this instanceof artikCloud)) return new artikCloud();
    }

    artikCloud.prototype.message = function(msg) {
        request.post({
            url: 'https://api.artik.cloud/v1.1/messages',
            json: true,
            headers: {
              Authorization: 'bearer '+device_token,
              "Content-Type": 'application/json'
            },
            body: {
              sdid: device_id,
              Authorization: 'bearer '+device_token,
              type: 'message',
              ts: Date.now(),
              data: msg
            }
        }, function(err, httpResponse, body) {
          console.log(body);
        })
    };

    module.exports = artikCloud();

}
