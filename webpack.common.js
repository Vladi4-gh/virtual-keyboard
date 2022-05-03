const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv, isProduction) => ({
  entry: {
    main: {
      import: './src/pages/main/index.ts',
      filename: `[name]${isProduction ? '.min' : ''}.js`
    },
    pets: {
      import: './src/pages/pets/index.ts',
      filename: `pets/[name]${isProduction ? '.min' : ''}.js`
    }
  },
  output: {
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/pages/main/index.html',
      favicon: './src/assets/images/icons/favicon.ico',
      chunks: ['main'],
      filename: 'index.html',
      inject: false,
      hash: isProduction,
      title: 'Shelter',
      mode: !isProduction ? 'development' : 'production'
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/pets/index.html',
      favicon: './src/assets/images/icons/favicon.ico',
      chunks: ['pets'],
      filename: 'pets/index.html',
      inject: false,
      hash: isProduction,
      title: 'Shelter - Our Pets',
      mode: !isProduction ? 'development' : 'production'
    }),
    new MiniCssExtractPlugin({
      filename: ({ chunk }) => `${chunk.name === 'pets' ? 'pets/' : ''}[name]${isProduction ? '.min' : ''}.css`
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/content',
          to: 'static/content'
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/images/[name][ext]'
        }
      },
      {
        test: /\.(ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[name][ext]'
        }
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.ts']
        },
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: ['...', new CssMinimizerPlugin()]
  }
});
