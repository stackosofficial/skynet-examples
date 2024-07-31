const webpack = require("webpack");
const getCacheIdentifier = require('react-dev-utils/getCacheIdentifier');

const shouldUseSourceMap = false;


module.exports = function override(config, env) {
  // Add your existing Webpack configuration
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    vm: require.resolve("vm-browserify"),
    http: require.resolve("stream-http"), // Add this line
    https: require.resolve("https-browserify"), // Add this line
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ]);

  const isEnvDevelopment = true;
  const isEnvProduction = false;
  const loaders = config.module.rules[1].oneOf;

  // Existing rules and experiments
  config.module.rules.push({
    test: /.wasm$/,
    type: "webassembly/sync",
  });

  config.experiments = {
    asyncWebAssembly: true,
    syncWebAssembly: true,
  };

  loaders.splice(loaders.length - 1, 0, {
    test: /\.(js|mjs|cjs)$/,
    exclude: /@babel(?:\/|\\{1,2})runtime/,
    loader: require.resolve('babel-loader'),
    options: {
      babelrc: false,
      configFile: false,
      compact: false,
      presets: [
        [
          require.resolve('babel-preset-react-app/dependencies'),
          { helpers: true },
        ],
      ],
      cacheDirectory: true,
      // See #6846 for context on why cacheCompression is disabled
      cacheCompression: false,
      // @remove-on-eject-begin
      cacheIdentifier: getCacheIdentifier(
        isEnvProduction
          ? 'production'
          : isEnvDevelopment && 'development',
        [
          'babel-plugin-named-asset-import',
          'babel-preset-react-app',
          'react-dev-utils',
          'react-scripts',
        ]
      ),
      sourceMaps: shouldUseSourceMap,
      inputSourceMap: shouldUseSourceMap,
    },
  });

  return config;
};