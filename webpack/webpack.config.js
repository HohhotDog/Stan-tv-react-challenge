const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // mode is passed from CLI: development (npm start) or production (npm run build:dist)
  entry: path.resolve(__dirname, '../src/index.tsx'),
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
    publicPath: '/', // required for SPA routing
  },
  resolve: { extensions: ['.ts', '.tsx', '.js'] },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/, // handle .ts, .tsx, .js, .jsx
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { esmodules: true } }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.css$/, // handle imported CSS
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/i, // images
        type: 'asset/resource',
        generator: { filename: 'assets/[name][ext]' },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // template for index.html
      filename: 'index.html',
      inject: 'body',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, '../public/data.json'), to: 'data.json' },
        { from: path.resolve(__dirname, '../public/logo.svg'), to: 'logo.svg' },
      ],
    }),
  ],
  // Dev server config for npm start
  devServer: {
    static: {
      directory: path.resolve(__dirname, '../public'), // serve static files from /public
    },
    historyApiFallback: true, // allow SPA routes (e.g. /program/1)
    hot: true, // enable HMR
    port: 3000, // dev server runs at http://localhost:3000
    open: true, // auto open browser
    client: {
      overlay: false, // do not block screen with full error overlay
    },
  },
  devtool: 'eval-source-map', // better source maps for debugging in dev mode
};