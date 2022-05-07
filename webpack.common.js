const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv, isProduction) => ({
  entry: {
    main: {
      import: './src/index.js',
      filename: `[name]${isProduction ? '.min' : ''}.js`,
    },
  },
  output: {
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './src/assets/images/icons/favicon.ico',
      chunks: ['main'],
      filename: 'index.html',
      inject: false,
      hash: isProduction,
      title: 'Virtual keyboard',
      mode: !isProduction ? 'development' : 'production',
    }),
    new MiniCssExtractPlugin({
      filename: `[name]${isProduction ? '.min' : ''}.css`,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/images/[name][ext]',
        },
      },
      {
        test: /\.(ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[name][ext]',
        },
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'resolve-url-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  optimization: {
    minimizer: ['...', new CssMinimizerPlugin()],
  },
});
