/* eslint-disable @typescript-eslint/no-var-requires */
const WorkerPlugin = require('worker-plugin');

module.exports = function override(config, _) {
    config.plugins.push(new WorkerPlugin());
    return config;
};
