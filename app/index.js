#!/bin/env node

{
    'use strict';
    const display = require(__dirname + '/libs/display.js');
    const supervisorClient = require(__dirname + '/libs/supervisorClient.js');
    const server = require(__dirname + '/libs/http.js');
    const artikCloud = require(__dirname + '/libs/artikCloud.js');
    const chalk = require('chalk');
    const _ = require('lodash');
    const debug = require('debug')('main');
    let updating = false;
    let dots = 0;

    display.init();
    console.log(chalk.cyan('Main application running'));
    supervisorClient.start(500, () => {
        supervisorClient.on('status', (status) => {
            console.log(chalk.white('Supervisor status update: ' + status));
            switch (status) {
                case "Idle":
                    display.image(display.presets.smile);
                    break;
                case "Installing":
                    display.image(display.presets.busy);
                    break;
                case "Downloading":
                    display.image(display.presets.download);
                    break;
                case "Starting":
                    display.image(display.presets.fwd);
                    break;
                case "Stopping":
                    display.image(display.presets.stop);
                    break;
            }
        });
    });
    server.start(() => {
        server.on('emoji', (emoji) => {
            console.log(chalk.magenta('new emoji received! applying...'));
            display.image(emoji);
            dots = _.filter(emoji, function(o) {
                return o;
            });
            artikCloud.message({
                "dots": dots.length,
                "imge": emoji
            });
        });
    });
}
