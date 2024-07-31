const webpack = require("webpack");

module.exports = function override(config, env) {
  // Add your existing Webpack configuration
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    vm: require.resolve("vm-browserify"),
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ]);

  // Existing rules and experiments
  config.module.rules.push({
    test: /\.wasm$/,
    type: "webassembly/sync",
  });

  config.experiments = {
    asyncWebAssembly: true,
    syncWebAssembly: true,
  };

  return config;
};
