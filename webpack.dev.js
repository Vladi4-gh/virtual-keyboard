const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = (env, argv) =>
  merge(common(env, argv, false), {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      port: 3000,
      open: true,
      static: {
        watch: true,
      },
      historyApiFallback: true,
    },
  });
