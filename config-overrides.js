const webpack = require('webpack');
module.exports = function override(config, env) {
    config.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve("util/"),
        vm: require.resolve("vm-browserify"),
        path: require.resolve("path-browserify"),
        process: require.resolve("process"),
        'process/browser': require.resolve('process/browser'),
    };
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
        }),
    );

    return config;
}
